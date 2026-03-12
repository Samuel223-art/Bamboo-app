import { 
  Leaf, 
  Zap, 
  Droplets, 
  Wind, 
  Sun, 
  Globe, 
  Trees, 
  Sprout,
  Cpu,
  Shield
} from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  type: 'Node' | 'Energy' | 'Agriculture' | 'Carbon' | 'RealEstate';
  icon: string;
  minAmount: number;
  maxAmount: number;
  durationDays: number;
  dailyYield: number; // percentage
  totalReturn: number; // percentage
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
}

const productNames = [
  "Emerald Bamboo Node", "Solar Flare Array", "Hydro-Flow Turbine", "Wind-Whisper Farm", "Terra-Firm Carbon Sink",
  "Azure Rain Collector", "Bio-Mass Digester", "Geothermal Core", "Ocean-Breeze Tidal", "Sky-High Vertical Farm",
  "Deep-Root Reforestation", "Clean-Current Grid", "Eco-Glass Greenhouse", "Pure-Path Water Filter", "Green-Steel Foundry",
  "Silent-Sun Panel", "Kinetic-Step Pavement", "Algae-Fuel Cell", "Mycelium-Brick Block", "Hemp-Fiber Textile",
  "Recycle-Ready Plastic", "Zero-Waste Hub", "Circular-City Unit", "Smart-Soil Sensor", "Drone-Seed Planter",
  "Nano-Filter Membrane", "Cold-Fusion Pilot", "Plasma-Waste Converter", "Bio-Plastic Polymer", "Eco-Concrete Slab",
  "Vertical-Axis Wind", "Transparent-Solar Pane", "Graphene-Battery Pack", "Hydrogen-Hype Station", "Carbon-Capture Fan",
  "Methane-Mop System", "Coral-Reef Restorer", "Mangrove-Marsh Guard", "Peatland-Preserve", "Wildflower-Way",
  "Urban-Orchard Plot", "Bee-Hive Network", "Insect-Protein Farm", "Lab-Grown Leather", "Precision-Irrigation",
  "Regenerative-Ranch", "Agro-Forestry Strip", "Seaweed-Snack Farm", "Pearl-Oyster Bed", "Blue-Carbon Offset"
];

const types: Product['type'][] = ['Node', 'Energy', 'Agriculture', 'Carbon', 'RealEstate'];
const icons = ['Leaf', 'Zap', 'Droplets', 'Wind', 'Sun', 'Globe', 'Trees', 'Sprout', 'Cpu', 'Shield'];

export const PRODUCTS: Product[] = productNames.map((name, index) => {
  const type = types[index % types.length];
  const icon = icons[index % icons.length];
  
  // Logic: Big amounts = Big rewards. Shortest cycle = 100 days.
  // We'll vary the duration from 100 to 365 days.
  const durationDays = 100 + (index * 5); 
  
  // Base amount increases with index
  const minAmount = 50 + (index * 100);
  const maxAmount = minAmount * 10;
  
  // Yield: Higher risk/amount usually means higher yield.
  // We'll make it between 1.2% and 4.0% daily to ensure total return > 100%
  const dailyYield = 1.2 + (index * 0.06);
  const totalReturn = dailyYield * durationDays;
  
  const riskLevel: Product['riskLevel'] = index < 15 ? 'Low' : index < 35 ? 'Medium' : 'High';

  const descriptions = {
    Node: `A high-performance computational unit dedicated to the Bamboo network. This node facilitates decentralized transactions and secure data processing, providing a steady stream of rewards for its operators.`,
    Energy: `Harnessing renewable resources to power the future. This investment supports large-scale sustainable energy infrastructure, converting natural forces into consistent financial yield.`,
    Agriculture: `Regenerative farming and sustainable food systems. By investing in this product, you support advanced agricultural techniques that restore soil health while producing high-value organic yields.`,
    Carbon: `Direct action against climate change. This product represents verified carbon sequestration projects, allowing you to earn returns while actively removing CO2 from the atmosphere.`,
    RealEstate: `Eco-conscious property development. Invest in the future of urban living with sustainable, energy-efficient buildings designed for long-term value and minimal environmental impact.`
  };

  return {
    id: `prod-${index + 1}`,
    name,
    type,
    icon,
    minAmount,
    maxAmount,
    durationDays,
    dailyYield: parseFloat(dailyYield.toFixed(2)),
    totalReturn: parseFloat(totalReturn.toFixed(2)),
    riskLevel,
    description: descriptions[type]
  };
});
