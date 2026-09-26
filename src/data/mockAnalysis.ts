import { AnalysisResult, RenovationCategory, BudgetCategory, PropertyType, MaterialItem, DesignRecommendation, BudgetBreakdown } from '../types';

// --- Material templates ---
const paintingMaterials = (area: number, budget: BudgetCategory): MaterialItem[] => {
  const multiplier = budget === 'luxury' ? 1.8 : budget === 'moderate' ? 1.2 : 1;
  const unitPrice = (base: number) => Math.round(base * multiplier);
  const liters = Math.ceil(area / 10);
  return [
    { id: 'm1', name: 'Premium Primer', specification: budget === 'luxury' ? 'Asian Paints Damp Shield' : budget === 'moderate' ? 'Berger All Guard Primer' : 'Generic White Primer', quantity: Math.ceil(liters * 0.5), unit: 'Litre', unitPrice: unitPrice(180), totalPrice: Math.ceil(liters * 0.5) * unitPrice(180) },
    { id: 'm2', name: 'Interior Emulsion Paint', specification: budget === 'luxury' ? 'Asian Paints Royale Matt' : budget === 'moderate' ? 'Berger Silk Breathe Easy' : 'Asian Paints Tractor Emulsion', quantity: liters, unit: 'Litre', unitPrice: unitPrice(220), totalPrice: liters * unitPrice(220) },
    { id: 'm3', name: 'Wall Putty / Filler', specification: 'Birla White WallCare Putty', quantity: Math.ceil(area * 1.2), unit: 'kg', unitPrice: 28, totalPrice: Math.ceil(area * 1.2) * 28 },
    { id: 'm4', name: 'Sandpaper (180 Grit)', specification: 'Norton Sandpaper Sheet', quantity: Math.ceil(area / 15), unit: 'Piece', unitPrice: 12, totalPrice: Math.ceil(area / 15) * 12 },
    { id: 'm5', name: 'Paint Roller Set', specification: '9-inch roller with tray', quantity: 2, unit: 'Set', unitPrice: 450, totalPrice: 900 },
    { id: 'm6', name: 'Paint Brush (2" & 4")', specification: 'Synthetic bristle', quantity: 4, unit: 'Piece', unitPrice: 80, totalPrice: 320 },
    { id: 'm7', name: 'Masking Tape', specification: '1.5-inch blue painters tape', quantity: Math.ceil(area / 20), unit: 'Roll', unitPrice: 65, totalPrice: Math.ceil(area / 20) * 65 },
    { id: 'm8', name: 'Drop Cloth / Cover Sheet', specification: '4m x 4m cotton canvas', quantity: 2, unit: 'Piece', unitPrice: 350, totalPrice: 700 },
  ];
};

const ceilingMaterials = (area: number, budget: BudgetCategory): MaterialItem[] => {
  const multiplier = budget === 'luxury' ? 2 : budget === 'moderate' ? 1.3 : 1;
  const unitPrice = (base: number) => Math.round(base * multiplier);
  const boards = Math.ceil(area / 2.88); // each 1200x2400 board
  return [
    { id: 'c1', name: 'Gypsum Board', specification: budget === 'luxury' ? '12.5mm Moisture Resistant' : '9.5mm Standard Board', quantity: boards, unit: 'Sheet', unitPrice: unitPrice(480), totalPrice: boards * unitPrice(480) },
    { id: 'c2', name: 'GI Framework / Grid', specification: '0.5mm GI Channel (Main + Cross Tee)', quantity: Math.ceil(area * 1.5), unit: 'Running Ft', unitPrice: 35, totalPrice: Math.ceil(area * 1.5) * 35 },
    { id: 'c3', name: 'GI Screws (Drywall)', specification: '25mm Drywall Screws (Box)', quantity: Math.ceil(boards / 4), unit: 'Box (200pc)', unitPrice: 220, totalPrice: Math.ceil(boards / 4) * 220 },
    { id: 'c4', name: 'Jointing Compound', specification: 'Gyproc Jointing Compound', quantity: Math.ceil(area * 0.3), unit: 'kg', unitPrice: 32, totalPrice: Math.ceil(area * 0.3) * 32 },
    { id: 'c5', name: 'Fibre Tape', specification: '50mm self-adhesive mesh tape', quantity: Math.ceil(boards / 2), unit: 'Roll', unitPrice: 95, totalPrice: Math.ceil(boards / 2) * 95 },
    { id: 'c6', name: 'Ceiling Paint', specification: budget === 'luxury' ? 'Asian Paints Royale' : 'Berger Emulsion', quantity: Math.ceil(area / 12), unit: 'Litre', unitPrice: unitPrice(195), totalPrice: Math.ceil(area / 12) * unitPrice(195) },
    { id: 'c7', name: 'LED Recessed Lights', specification: budget === 'luxury' ? '9W Philips Hue-Compatible' : '7W LED Downlight', quantity: Math.ceil(area / 10), unit: 'Piece', unitPrice: unitPrice(380), totalPrice: Math.ceil(area / 10) * unitPrice(380) },
    { id: 'c8', name: 'Cove LED Strip (optional)', specification: '12V RGB LED Strip 5m', quantity: Math.ceil(Math.sqrt(area) * 0.8), unit: 'Roll', unitPrice: 850, totalPrice: Math.ceil(Math.sqrt(area) * 0.8) * 850 },
  ];
};

const doorMaterials = (count: number, budget: BudgetCategory): MaterialItem[] => {
  const multiplier = budget === 'luxury' ? 2.2 : budget === 'moderate' ? 1.4 : 1;
  const unitPrice = (base: number) => Math.round(base * multiplier);
  return [
    { id: 'd1', name: 'Door Panel', specification: budget === 'luxury' ? 'Teak Wood Solid Panel' : budget === 'moderate' ? 'Engineered Wood Flush Door' : 'HDF Flush Door', quantity: count, unit: 'Piece', unitPrice: unitPrice(8500), totalPrice: count * unitPrice(8500) },
    { id: 'd2', name: 'Door Frame', specification: budget === 'luxury' ? 'Teak Wood Frame' : 'Sal Wood Frame', quantity: count, unit: 'Set', unitPrice: unitPrice(3200), totalPrice: count * unitPrice(3200) },
    { id: 'd3', name: 'Door Hinges', specification: '4-inch SS Butt Hinge', quantity: count * 3, unit: 'Piece', unitPrice: 95, totalPrice: count * 3 * 95 },
    { id: 'd4', name: 'Door Handle / Lock', specification: budget === 'luxury' ? 'Godrej Mortise Lock Set' : 'Standard Cylindrical Lock', quantity: count, unit: 'Set', unitPrice: unitPrice(750), totalPrice: count * unitPrice(750) },
    { id: 'd5', name: 'Door Stopper', specification: 'Floor-mounted SS door stopper', quantity: count, unit: 'Piece', unitPrice: 120, totalPrice: count * 120 },
    { id: 'd6', name: 'Wood Primer + Paint/Polish', specification: budget === 'luxury' ? 'Melamine Polish Kit' : 'Enamel Paint', quantity: count * 2, unit: 'Litre', unitPrice: unitPrice(280), totalPrice: count * 2 * unitPrice(280) },
    { id: 'd7', name: 'Installation Hardware', specification: 'Screws, Anchors, Expansion Bolts', quantity: count, unit: 'Set', unitPrice: 180, totalPrice: count * 180 },
  ];
};

const windowMaterials = (count: number, budget: BudgetCategory): MaterialItem[] => {
  const multiplier = budget === 'luxury' ? 2.0 : budget === 'moderate' ? 1.35 : 1;
  const unitPrice = (base: number) => Math.round(base * multiplier);
  return [
    { id: 'w1', name: 'Window Frame', specification: budget === 'luxury' ? 'UPVC 5-Chamber Profile' : budget === 'moderate' ? 'UPVC 3-Chamber Profile' : 'Aluminium Sliding Frame', quantity: count, unit: 'Piece', unitPrice: unitPrice(6500), totalPrice: count * unitPrice(6500) },
    { id: 'w2', name: 'Glass Panel', specification: budget === 'luxury' ? '6mm Double Glazed Low-E' : budget === 'moderate' ? '5mm Toughened Glass' : '4mm Clear Float Glass', quantity: count * 2, unit: 'Piece', unitPrice: unitPrice(1800), totalPrice: count * 2 * unitPrice(1800) },
    { id: 'w3', name: 'Window Handle', specification: 'SS Espagnolette Handle', quantity: count, unit: 'Set', unitPrice: 350, totalPrice: count * 350 },
    { id: 'w4', name: 'Window Lock', specification: 'UPVC Multi-Point Lock', quantity: count, unit: 'Piece', unitPrice: 480, totalPrice: count * 480 },
    { id: 'w5', name: 'Mosquito Net / Screen', specification: 'Fibreglass mesh screen', quantity: count, unit: 'Set', unitPrice: 650, totalPrice: count * 650 },
    { id: 'w6', name: 'Sealant / Silicone', specification: 'Weatherproof silicone sealant', quantity: count * 2, unit: 'Tube', unitPrice: 95, totalPrice: count * 2 * 95 },
    { id: 'w7', name: 'Installation Kit', specification: 'Frame fixings, screws, foam', quantity: count, unit: 'Set', unitPrice: 220, totalPrice: count * 220 },
  ];
};

const furnitureMaterials = (units: number, budget: BudgetCategory): MaterialItem[] => {
  const multiplier = budget === 'luxury' ? 2.5 : budget === 'moderate' ? 1.5 : 1;
  const unitPrice = (base: number) => Math.round(base * multiplier);
  return [
    { id: 'f1', name: 'Plywood / MDF Board', specification: budget === 'luxury' ? '19mm BWP Marine Plywood' : budget === 'moderate' ? '18mm Commercial Plywood' : '16mm MDF Board', quantity: units * 4, unit: 'Sheet', unitPrice: unitPrice(1800), totalPrice: units * 4 * unitPrice(1800) },
    { id: 'f2', name: 'Edge Banding Tape', specification: '22mm PVC Melamine Edge Band', quantity: units * 20, unit: 'Meter', unitPrice: 8, totalPrice: units * 20 * 8 },
    { id: 'f3', name: 'Cabinet Hinges', specification: budget === 'luxury' ? 'Hettich Soft-Close Hinge' : 'Standard 35mm Hinge', quantity: units * 4, unit: 'Piece', unitPrice: unitPrice(180), totalPrice: units * 4 * unitPrice(180) },
    { id: 'f4', name: 'Drawer Slides', specification: budget === 'luxury' ? 'Blum Tandem 550mm' : 'Telescopic Slide 400mm', quantity: units * 2, unit: 'Pair', unitPrice: unitPrice(520), totalPrice: units * 2 * unitPrice(520) },
    { id: 'f5', name: 'Handles / Knobs', specification: budget === 'luxury' ? 'Brass Antique Handle' : 'SS Finish Handle', quantity: units * 4, unit: 'Piece', unitPrice: unitPrice(120), totalPrice: units * 4 * unitPrice(120) },
    { id: 'f6', name: 'Laminate / Veneer Sheet', specification: budget === 'luxury' ? 'Natural Wood Veneer' : '1mm Decorative Laminate', quantity: units * 3, unit: 'Sheet', unitPrice: unitPrice(950), totalPrice: units * 3 * unitPrice(950) },
    { id: 'f7', name: 'Screws & Fasteners', specification: 'Assorted cabinet screws set', quantity: units, unit: 'Box', unitPrice: 120, totalPrice: units * 120 },
    { id: 'f8', name: 'Finish / Polish', specification: budget === 'luxury' ? 'PU Matt Lacquer' : 'Melamine Finish', quantity: units * 2, unit: 'Litre', unitPrice: unitPrice(350), totalPrice: units * 2 * unitPrice(350) },
  ];
};

// Budget Breakdown computation
const computeBudget = (materials: MaterialItem[], budget: BudgetCategory, category: RenovationCategory): BudgetBreakdown => {
  const materialTotal = materials.reduce((s, m) => s + m.totalPrice, 0);
  const labourRatio = category === 'furniture' ? 0.55 : category === 'ceiling' ? 0.65 : 0.45;
  const labour = Math.round(materialTotal * labourRatio);
  const transport = Math.round(materialTotal * 0.06);
  const misc = Math.round(materialTotal * 0.04);
  const contingency = Math.round((materialTotal + labour) * 0.08);
  return {
    material: materialTotal,
    labour,
    transport,
    misc,
    contingency,
    total: materialTotal + labour + transport + misc + contingency,
  };
};

// Design recommendations
const paintingRecommendations = (budget: BudgetCategory, property: PropertyType): DesignRecommendation[] => [
  {
    title: budget === 'luxury' ? 'Warm Ivory Elegance' : budget === 'moderate' ? 'Sage Green Serenity' : 'Classic Off-White',
    label: 'Recommended',
    description: budget === 'luxury'
      ? 'A sophisticated ivory tone exudes timeless luxury. Pairs beautifully with gold accents and dark wood furniture.'
      : budget === 'moderate'
      ? 'A calming sage green brings nature indoors. Ideal for living rooms and bedrooms. Pairs with wood and linen.'
      : 'A clean off-white creates a bright, airy feel. Versatile and budget-friendly with timeless appeal.',
    primaryColor: budget === 'luxury' ? 'Warm Ivory' : budget === 'moderate' ? 'Sage Green' : 'Classic Off-White',
    primaryColorHex: budget === 'luxury' ? '#F5EDD7' : budget === 'moderate' ? '#7F9E7F' : '#F2EFE6',
    complementaryColors: budget === 'luxury'
      ? [{ name: 'Antique Gold', hex: '#C9A84C' }, { name: 'Rich Mocha', hex: '#6B4C3B' }, { name: 'Cream', hex: '#FAF5EB' }]
      : budget === 'moderate'
      ? [{ name: 'Warm White', hex: '#F8F5F0' }, { name: 'Terracotta', hex: '#C17F5C' }, { name: 'Dusty Blue', hex: '#7A9BB5' }]
      : [{ name: 'Light Grey', hex: '#E0DEDD' }, { name: 'Beige', hex: '#F0EAD6' }, { name: 'Pale Blue', hex: '#D6E4F0' }],
    finish: budget === 'luxury' ? 'Royale Matt' : budget === 'moderate' ? 'Satin / Sheen' : 'Matt Emulsion',
    tags: ['Wall Paint', budget === 'luxury' ? 'Premium' : budget === 'moderate' ? 'Mid-Range' : 'Affordable', property === 'urban' ? 'Urban' : 'Rural'],
  },
  {
    title: 'Dusty Rose Warmth',
    label: 'Alternative 1',
    description: 'A soft dusty rose adds warmth and personality to spaces. Works well in bedrooms and dining rooms with natural wood accents.',
    primaryColor: 'Dusty Rose',
    primaryColorHex: '#C9907A',
    complementaryColors: [{ name: 'Warm Grey', hex: '#B0A89E' }, { name: 'Ivory', hex: '#F5F0E8' }],
    finish: 'Soft Sheen',
    tags: ['Warm Tone', 'Bedroom', 'Dining'],
  },
  {
    title: 'Slate Blue Calm',
    label: 'Alternative 2',
    description: 'Slate blue creates a calming, focused atmosphere. Perfect for home offices, libraries, or accent walls.',
    primaryColor: 'Slate Blue',
    primaryColorHex: '#7A8FA6',
    complementaryColors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Warm Linen', hex: '#EDE8DF' }],
    finish: 'Eggshell',
    tags: ['Cool Tone', 'Office', 'Accent Wall'],
  },
];

const ceilingRecommendations = (budget: BudgetCategory): DesignRecommendation[] => [
  {
    title: budget === 'luxury' ? 'Multi-Level Cove Ceiling' : budget === 'moderate' ? 'Simple False Ceiling with Cove' : 'Basic Gypsum Flat Ceiling',
    label: 'Recommended',
    description: budget === 'luxury'
      ? 'An architectural multi-level cove ceiling with integrated LED lighting creates a dramatic, hotel-like ambience.'
      : budget === 'moderate'
      ? 'A clean false ceiling with cove lighting adds depth and a premium feel without excessive cost.'
      : 'A clean flat gypsum false ceiling lowers perceived ceiling height and conceals wires neatly.',
    material: budget === 'luxury' ? '12.5mm Moisture-Resistant Gypsum + Cove Lighting' : budget === 'moderate' ? '9.5mm Gypsum + LED Cove' : '9.5mm Standard Gypsum Board',
    tags: ['Ceiling', budget === 'luxury' ? 'Luxury' : budget === 'moderate' ? 'Moderate' : 'Budget'],
  },
  {
    title: 'Coffered Grid Design',
    label: 'Alternative 1',
    description: 'A coffered grid ceiling adds classic architectural character. Best for large living or dining rooms.',
    material: '12mm Gypsum with POP moulding strips',
    tags: ['Classic', 'Living Room'],
  },
  {
    title: 'Exposed Concrete + Spotlights',
    label: 'Alternative 2',
    description: 'For an industrial-modern aesthetic, clean exposed concrete with track spotlights is striking and low-maintenance.',
    material: 'Exposed RCC with surface-mounted track lights',
    tags: ['Industrial', 'Modern', 'Minimal'],
  },
];

const doorRecommendations = (budget: BudgetCategory, property: PropertyType): DesignRecommendation[] => [
  {
    title: budget === 'luxury' ? 'Solid Teak Panel Door' : budget === 'moderate' ? 'Engineered Wood Flush Door' : 'HDF Flush Door',
    label: 'Recommended',
    description: budget === 'luxury'
      ? 'Solid teak doors with hand-crafted panels offer unmatched durability, elegance, and a premium finish.'
      : budget === 'moderate'
      ? 'Engineered wood doors balance aesthetics and durability. Available in veneer and laminate finishes.'
      : 'HDF flush doors offer a clean, simple look at an affordable price. Great for budget renovations.',
    material: budget === 'luxury' ? 'Solid Teak Wood' : budget === 'moderate' ? 'Engineered Hardwood Core' : 'High-Density Fibreboard',
    tags: ['Door', budget === 'luxury' ? 'Luxury' : budget === 'moderate' ? 'Mid-Range' : 'Budget'],
  },
  {
    title: 'Glass Panel Door',
    label: 'Alternative 1',
    description: 'A partially glazed door with frosted or clear glass allows light transfer between rooms while maintaining privacy.',
    material: 'Wooden frame + 5mm tempered glass panel',
    tags: ['Light-Friendly', 'Modern', 'Semi-Private'],
  },
  {
    title: 'Sliding Barn Door',
    label: 'Alternative 2',
    description: 'Space-saving sliding barn doors are trendy and practical for urban apartments with limited swing space.',
    material: 'Engineered wood on metal rail system',
    tags: ['Space-Saving', 'Trendy', 'Urban'],
  },
];

const windowRecommendations = (budget: BudgetCategory): DesignRecommendation[] => [
  {
    title: budget === 'luxury' ? 'UPVC Double-Glazed Casement' : budget === 'moderate' ? 'UPVC Single-Glazed Sliding' : 'Aluminium Sliding Window',
    label: 'Recommended',
    description: budget === 'luxury'
      ? 'UPVC double-glazed windows offer excellent thermal insulation, noise reduction, and a premium look.'
      : budget === 'moderate'
      ? 'UPVC sliding windows provide good insulation and low maintenance at a mid-range price.'
      : 'Aluminium sliding windows are lightweight, durable, and cost-effective for budget renovations.',
    material: budget === 'luxury' ? 'UPVC + 6mm Double Glaze' : budget === 'moderate' ? 'UPVC + 5mm Toughened' : 'Aluminium + 4mm Float Glass',
    tags: ['Window', budget === 'luxury' ? 'Premium' : budget === 'moderate' ? 'Mid-Range' : 'Budget'],
  },
  {
    title: 'Bay Window with Seat',
    label: 'Alternative 1',
    description: 'A bay window extension creates a cosy reading nook and adds architectural interest to the façade.',
    material: 'UPVC or Wood frame, panoramic glass',
    tags: ['Architectural', 'Living Room', 'Reading Nook'],
  },
  {
    title: 'Louvered Ventilation Window',
    label: 'Alternative 2',
    description: 'Louvered windows allow constant natural ventilation without full opening — ideal for bathrooms and kitchens.',
    material: 'Aluminium louvre blades, anodised finish',
    tags: ['Ventilation', 'Bathroom', 'Kitchen'],
  },
];

const furnitureRecommendations = (budget: BudgetCategory, property: PropertyType): DesignRecommendation[] => [
  {
    title: budget === 'luxury' ? 'Custom Solid Wood Furniture' : budget === 'moderate' ? 'Modular Plywood Furniture' : 'MDF Laminate Furniture',
    label: 'Recommended',
    description: budget === 'luxury'
      ? 'Custom solid wood pieces with natural veneer finish offer longevity and a unique, bespoke aesthetic.'
      : budget === 'moderate'
      ? 'Modular plywood furniture with laminate finish balances quality and cost — easy to customise.'
      : 'MDF furniture with PVC or laminate finish is affordable, lightweight, and visually clean.',
    material: budget === 'luxury' ? 'Solid Teak / Sheesham Wood' : budget === 'moderate' ? '18mm BWR Plywood + Laminate' : '16mm MDF + PVC Foil',
    tags: ['Furniture', property === 'rural' ? 'Traditional' : 'Contemporary'],
  },
  {
    title: 'Scandinavian Minimalist',
    label: 'Alternative 1',
    description: 'Light-toned wood with clean lines and minimal ornamentation. Ideal for small urban apartments.',
    material: 'Birch veneer or beech solid wood',
    tags: ['Minimalist', 'Scandinavian', 'Space-Saving'],
  },
  {
    title: 'Industrial Pipe & Wood',
    label: 'Alternative 2',
    description: 'Black iron pipe frames with reclaimed wood shelves create a striking industrial look.',
    material: 'Black powder-coated MS pipes + reclaimed wood',
    tags: ['Industrial', 'Trendy', 'DIY-Friendly'],
  },
];

// Main generator
export const generateMockAnalysis = (
  category: RenovationCategory,
  budget: BudgetCategory,
  propertyType: PropertyType,
  measurements: Record<string, number | string | undefined>,
  preferences: Record<string, string | undefined>,
  imageUrl?: string
): AnalysisResult => {
  let area = 0;
  let count = 1;
  let materials: MaterialItem[] = [];
  let recommendations: DesignRecommendation[] = [];

  if (category === 'painting') {
    const l = Number(measurements.wallLength) || 4;
    const h = Number(measurements.wallHeight) || 3;
    const n = Number(measurements.numWalls) || 2;
    area = l * h * n;
    materials = paintingMaterials(area, budget);
    recommendations = paintingRecommendations(budget, propertyType);
  } else if (category === 'ceiling') {
    const l = Number(measurements.ceilingLength) || 5;
    const w = Number(measurements.ceilingWidth) || 4;
    area = l * w;
    materials = ceilingMaterials(area, budget);
    recommendations = ceilingRecommendations(budget);
  } else if (category === 'doors') {
    count = Number(measurements.numDoors) || 2;
    materials = doorMaterials(count, budget);
    recommendations = doorRecommendations(budget, propertyType);
  } else if (category === 'windows') {
    count = Number(measurements.numWindows) || 3;
    materials = windowMaterials(count, budget);
    recommendations = windowRecommendations(budget);
  } else if (category === 'furniture') {
    count = Number(measurements.numFurnitureUnits) || 2;
    materials = furnitureMaterials(count, budget);
    recommendations = furnitureRecommendations(budget, propertyType);
  }

  const budgetBreakdown = computeBudget(materials, budget, category);
  const categoryNames: Record<string, string> = {
    painting: 'Painting & Walls',
    ceiling: 'Ceiling Design',
    doors: 'Doors',
    windows: 'Windows',
    furniture: 'Furniture',
  };

  return {
    id: `analysis-${Date.now()}`,
    projectName: `${categoryNames[category || 'painting']} Project`,
    category,
    budget,
    propertyType,
    imagePreviewUrl: imageUrl,
    measurements: measurements as any,
    preferences: preferences as any,
    recommendations,
    materials,
    budgetBreakdown,
    createdAt: new Date().toISOString(),
  };
};
