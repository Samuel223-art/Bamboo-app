import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, query, where, getDocs, addDoc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { PRODUCTS } from "./src/constants/products.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function verifyTronTransaction(txHash: string, expectedAmount: number) {
  const TRONGRID_API_KEY = process.env.TRONGRID_API_KEY;
  const MY_WALLET = process.env.MY_WALLET_ADDRESS;
  const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

  if (!TRONGRID_API_KEY || !MY_WALLET) {
    console.error('Missing environment variables: TRONGRID_API_KEY or MY_WALLET_ADDRESS');
    return { valid: false, error: 'Server configuration error.' };
  }

  try {
    // 1. Get transaction events (best for TRC20)
    const eventsResponse = await axios.get(`https://api.trongrid.io/v1/transactions/${txHash}/events`, {
      headers: { 'TRON-PRO-API-KEY': TRONGRID_API_KEY }
    });

    const events = eventsResponse.data.data;
    if (!events || events.length === 0) {
      // If no events, maybe it's too new? Or not a contract call.
      return { valid: false, error: 'No events found. Ensure the transaction is confirmed.' };
    }

    // Find the Transfer event for USDT
    const transferEvent = events.find((e: any) => 
      e.event_name === 'Transfer' && 
      (e.contract_address === USDT_CONTRACT || e.contract_address === 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')
    );

    if (!transferEvent) {
      return { valid: false, error: 'USDT Transfer event not found in this transaction.' };
    }

    const { to, value } = transferEvent.result;
    
    // Compare recipient address
    // Note: TronGrid v1 events returns addresses in base58
    if (to !== MY_WALLET) {
       return { valid: false, error: `Recipient mismatch. This transaction was sent to ${to}, not your wallet.` };
    }

    const actualAmount = Number(value) / 1_000_000; // USDT has 6 decimals
    
    // Check amount (allow small difference for fees if any, though transfer value should be exact)
    if (Math.abs(actualAmount - expectedAmount) > 0.01) {
      return { valid: false, error: `Amount mismatch. Blockchain shows $${actualAmount}, but you entered $${expectedAmount}.` };
    }

    return { valid: true, amount: actualAmount };
  } catch (error: any) {
    console.error('Tron Verification Error:', error.response?.data || error.message);
    return { valid: false, error: 'Blockchain verification failed. Please check your TXID.' };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/register", async (req, res) => {
    const { email, password, name, referralCode } = req.body;
    try {
      // Check if user already exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Generate a simple ID
      const userId = Date.now().toString();
      
      // Generate unique referral code for the new user: BAM-XXXX
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const userReferralCode = `BAM-${randomDigits}`;

      let initialBalance = 20;
      let referrerId = null;

      // Check if referral code is valid
      if (referralCode) {
        const referrerQuery = query(usersRef, where("my_referral_code", "==", referralCode));
        const referrerSnapshot = await getDocs(referrerQuery);
        
        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          referrerId = referrerDoc.id;
          
          // 1. Referee (new user) gets $5 bonus
          initialBalance += 5;
          
          // 2. Referrer gets $6 bonus
          const referrerRef = doc(db, "users", referrerId);
          await updateDoc(referrerRef, {
            balance: increment(6)
          });

          // Notify referrer
          await addDoc(collection(db, "notifications"), {
            userId: referrerId,
            title: "Referral Bonus!",
            message: `Someone joined using your code! You've received a $6 bonus.`,
            type: "referral",
            read: false,
            createdAt: serverTimestamp()
          });
        }
      }

      const userData = {
        id: userId,
        email,
        password, // In a real app, hash this!
        name,
        referral_code_used: referralCode || null,
        referred_by: referrerId,
        my_referral_code: userReferralCode,
        balance: initialBalance,
        isVerified: false,
        isPremium: false,
        streak: 1,
        lastLoginDate: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "users", userId), userData);

      // Create a notification
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        title: "Welcome to Bamboo Capital!",
        message: `Your registration was successful. We've credited your account with a $20 welcome bonus${referrerId ? " plus a $5 referral bonus" : ""}!`,
        type: "welcome",
        read: false,
        createdAt: serverTimestamp()
      });

      const finalUser = { 
        id: userId, 
        email, 
        name, 
        balance: initialBalance, 
        my_referral_code: userReferralCode,
        isVerified: false,
        isPremium: false
      };

      res.json({ success: true, user: finalUser });
    } catch (error: any) {
      console.error("Firestore Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/claim-earnings", async (req, res) => {
    const { userId, investmentId } = req.body;
    try {
      const invRef = doc(db, "investments", investmentId);
      const invSnap = await getDoc(invRef);
      
      if (!invSnap.exists()) return res.status(404).json({ error: "Investment not found" });
      
      const inv = invSnap.data();
      if (inv.userId !== userId) return res.status(403).json({ error: "Unauthorized" });
      
      // Calculate earnings since last claim or start date
      const lastClaim = inv.lastClaimDate ? inv.lastClaimDate.toMillis() : inv.startDate.toMillis();
      const now = Date.now();
      const diffMs = now - lastClaim;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      
      // Max duration check
      const start = inv.startDate.toMillis();
      const totalElapsedDays = (now - start) / (1000 * 60 * 60 * 24);
      const claimableDays = Math.min(diffDays, Math.max(0, inv.durationDays - (totalElapsedDays - diffDays)));
      
      const earnings = (inv.amount * inv.dailyYield * claimableDays) / 100;
      
      if (earnings <= 0) return res.status(400).json({ error: "No earnings to claim yet" });

      // Update user balance
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const user = userSnap.data();
      
      await updateDoc(userRef, {
        balance: increment(earnings)
      });

      // Update investment last claim date
      await updateDoc(invRef, {
        lastClaimDate: serverTimestamp()
      });

      // Handle Referral Commission (7%)
      if (user && user.referred_by) {
        const commission = earnings * 0.07;
        const referrerRef = doc(db, "users", user.referred_by);
        
        await updateDoc(referrerRef, {
          balance: increment(commission)
        });

        // Notify referrer
        await addDoc(collection(db, "notifications"), {
          userId: user.referred_by,
          title: "Referral Commission!",
          message: `You've earned $${commission.toFixed(2)} (7%) from your referral's harvest!`,
          type: "commission",
          read: false,
          createdAt: serverTimestamp()
        });
      }

      res.json({ success: true, earnings, newBalance: (user?.balance || 0) + earnings });
    } catch (error) {
      console.error("Claim Error:", error);
      res.status(500).json({ error: "Failed to claim earnings" });
    }
  });

  app.post("/api/deposit", async (req, res) => {
    const { userId, amount, txHash, network } = req.body;
    try {
      // 0. Enforce minimum deposit
      if (Number(amount) < 100) {
        return res.status(400).json({ error: "Minimum deposit is $100." });
      }

      // 1. Check if this TXID has already been used to prevent double-spending
      const depositsRef = collection(db, "deposits");
      const q = query(depositsRef, where("txHash", "==", txHash));
      const existingDeposits = await getDocs(q);
      
      if (!existingDeposits.empty) {
        return res.status(400).json({ error: "This transaction hash has already been used." });
      }

      // 2. Verify with TronGrid
      const verification = await verifyTronTransaction(txHash, amount);
      
      if (!verification.valid) {
        return res.status(400).json({ error: verification.error });
      }

      // 3. Create a deposit record
      const depositData = {
        userId,
        amount: verification.amount || amount,
        txHash,
        network,
        status: "completed",
        verifiedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      const depositRef = await addDoc(collection(db, "deposits"), depositData);

      // 4. Update the user's balance in Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        balance: increment(verification.amount || amount),
        isPremium: true
      });

      // 5. Create a success notification for the user
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        title: "Deposit Confirmed",
        message: `Success! Your deposit of $${verification.amount || amount} has been verified on the blockchain and credited to your balance.`,
        type: "success",
        read: false,
        createdAt: serverTimestamp()
      });

      res.json({ success: true, depositId: depositRef.id });
    } catch (error) {
      console.error("Deposit Error:", error);
      res.status(500).json({ error: "Failed to process deposit" });
    }
  });

  app.post("/api/withdraw", async (req, res) => {
    const { userId, amount, walletAddress, network } = req.body;
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return res.status(404).json({ error: "User not found" });
      const user = userSnap.data();

      // 1. Check balance
      if (user.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // 2. Check eligibility (at least one completed investment)
      const q = query(collection(db, "investments"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const investments = querySnapshot.docs.map(doc => doc.data());

      const now = new Date();
      const hasCompletedInvestment = investments.some(inv => {
        const endDate = inv.endDate?.seconds ? new Date(inv.endDate.seconds * 1000) : new Date(inv.endDate);
        return endDate <= now;
      });

      if (!hasCompletedInvestment) {
        return res.status(403).json({ 
          error: "Withdrawal locked. You must complete at least one investment cycle before you can withdraw funds." 
        });
      }

      // 3. Process withdrawal
      const withdrawalData = {
        userId,
        amount,
        walletAddress,
        network,
        status: "pending",
        createdAt: serverTimestamp()
      };

      const withdrawRef = await addDoc(collection(db, "withdrawals"), withdrawalData);

      // 4. Update user balance
      await updateDoc(userRef, {
        balance: increment(-amount)
      });

      // 5. Create notification
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        title: "Withdrawal Requested",
        message: `Your withdrawal request for $${amount} has been submitted and is being processed.`,
        type: "withdrawal",
        read: false,
        createdAt: serverTimestamp()
      });

      res.json({ success: true, withdrawalId: withdrawRef.id });
    } catch (error) {
      console.error("Withdrawal Error:", error);
      res.status(500).json({ error: "Failed to process withdrawal" });
    }
  });

  app.get("/api/referral-stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("referred_by", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const totalReferrals = querySnapshot.size;
      const totalEarned = totalReferrals * 6; // $6 per referral
      
      const referrals = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          name: data.name,
          date: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Recently',
          status: 'Completed'
        };
      });

      res.json({
        totalReferrals,
        totalEarned,
        referrals
      });
    } catch (error) {
      console.error("Referral Stats Error:", error);
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    try {
      const userRef = doc(db, "users", req.params.id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        res.json(userSnap.data());
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const userRef = doc(db, "users", req.params.id);
      const updateData = req.body;
      
      // Remove sensitive fields if they exist in body
      delete updateData.id;
      delete updateData.email;
      delete updateData.password;
      delete updateData.balance;
      delete updateData.createdAt;

      await updateDoc(userRef, updateData);
      res.json({ success: true });
    } catch (error) {
      console.error("Update User Error:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();
        
        // Streak logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        let currentStreak = user.streak || 0;
        const lastLogin = user.lastLoginDate?.seconds ? new Date(user.lastLoginDate.seconds * 1000) : null;
        
        if (lastLogin) {
          const lastLoginDate = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()).getTime();
          const diffDays = (today - lastLoginDate) / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            // Logged in yesterday, increment streak
            currentStreak += 1;
          } else if (diffDays > 1) {
            // Missed a day, reset streak
            currentStreak = 1;
          }
          // If diffDays === 0, already logged in today, keep streak as is
        } else {
          // First time logging in or no record
          currentStreak = 1;
        }

        // Migration: Generate referral code if missing
        const updates: any = {
          lastLoginDate: serverTimestamp(),
          streak: currentStreak
        };
        
        if (!user.my_referral_code) {
          const randomDigits = Math.floor(1000 + Math.random() * 9000);
          const newCode = `BAM-${randomDigits}`;
          updates.my_referral_code = newCode;
          user.my_referral_code = newCode;
        }

        await updateDoc(userDoc.ref, updates);
        user.streak = currentStreak;

        // Don't send password back
        const { password: _, ...userWithoutPassword } = user;
        res.json({ 
          success: true, 
          user: userWithoutPassword
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error: any) {
      console.error("Firestore Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/notifications/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const q = query(collection(db, "notifications"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/products", (req, res) => {
    res.json(PRODUCTS);
  });

  app.post("/api/invest", async (req, res) => {
    const { userId, productId, amount } = req.body;
    try {
      // 1. Get user to check balance
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userSnap.data();
      if (user.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // 2. Get product details
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // 3. Deduct balance and set verified status
      await updateDoc(userRef, {
        balance: increment(-amount),
        isVerified: true
      });

      // 4. Create investment record
      const investmentData = {
        userId,
        productId,
        productName: product.name,
        amount,
        dailyYield: product.dailyYield,
        durationDays: product.durationDays,
        status: "active",
        startDate: serverTimestamp(),
        endDate: new Date(Date.now() + product.durationDays * 24 * 60 * 60 * 1000),
        totalProjectedReturn: (amount * product.dailyYield * product.durationDays) / 100
      };

      const invRef = await addDoc(collection(db, "investments"), investmentData);

      // 5. Create notification
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        title: "Investment Successful",
        message: `You've successfully invested $${amount} in ${product.name}. Your projected return is $${investmentData.totalProjectedReturn.toFixed(2)}.`,
        type: "investment",
        read: false,
        createdAt: serverTimestamp()
      });

      res.json({ success: true, investmentId: invRef.id, newBalance: user.balance - amount });
    } catch (error) {
      console.error("Investment Error:", error);
      res.status(500).json({ error: "Failed to process investment" });
    }
  });

  app.get("/api/investments/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const q = query(collection(db, "investments"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const investments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(investments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch investments" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
