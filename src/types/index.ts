// Context types
export type RenovationCategory = 'painting' | 'ceiling' | 'doors' | 'windows' | 'furniture' | null;
export type BudgetCategory = 'luxury' | 'moderate' | 'budget' | null;
export type PropertyType = 'urban' | 'rural' | null;
export type DesignStyle = 'Modern' | 'Minimalist' | 'Traditional' | 'Contemporary' | 'Classic';

export interface Measurements {
  // Walls
  wallLength?: number;
  wallHeight?: number;
  numWalls?: number;
  numDoorsInWall?: number;
  numWindowsInWall?: number;
  // Ceiling
  ceilingLength?: number;
  ceilingWidth?: number;
  ceilingType?: string;
  // Door/Window
  doorHeight?: number;
  doorWidth?: number;
  numDoors?: number;
  windowHeight?: number;
  windowWidth?: number;
  numWindows?: number;
  // Furniture
  furnitureType?: string;
  furnitureLength?: number;
  furnitureWidth?: number;
  furnitureHeight?: number;
  numFurnitureUnits?: number;
  // Unit
  unit?: 'meters' | 'feet';
}

export interface Preferences {
  colorPalette?: string;
  designStyle?: DesignStyle;
  specialRequirements?: string;
  preferredMaterial?: string;
}

export interface AnalysisState {
  category: RenovationCategory;
  budget: BudgetCategory;
  propertyType: PropertyType;
  uploadedImages: File[];
  imagePreviewUrls: string[];
  measurements: Measurements;
  preferences: Preferences;
}

export interface MaterialItem {
  id: string;
  name: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface BudgetBreakdown {
  material: number;
  labour: number;
  transport: number;
  misc: number;
  contingency: number;
  total: number;
}

export interface DesignRecommendation {
  title: string;
  label: 'Recommended' | 'Alternative 1' | 'Alternative 2';
  description: string;
  primaryColor?: string;
  primaryColorHex?: string;
  complementaryColors?: { name: string; hex: string }[];
  imageUrl?: string;
  finish?: string;
  material?: string;
  tags: string[];
}

export interface AnalysisResult {
  id: string;
  projectName: string;
  category: RenovationCategory;
  budget: BudgetCategory;
  propertyType: PropertyType;
  imagePreviewUrl?: string;
  measurements: Measurements;
  preferences: Preferences;
  recommendations: DesignRecommendation[];
  materials: MaterialItem[];
  budgetBreakdown: BudgetBreakdown;
  createdAt: string;
}

export interface Professional {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  specialization: string;
  serviceArea: string;
  experience: number;
  rating: number;
  reviews: number;
  startingPrice: number;
  consultationFee: number;
  availability: 'Available' | 'Busy' | 'Limited';
  verified: boolean;
  distance?: number;
  portfolio: string[];
  skills: string[];
  services: string[];
  bio: string;
  slots: string[];
}

export interface Project {
  id: string;
  name: string;
  category: RenovationCategory;
  thumbnail?: string;
  budget: number;
  createdAt: string;
  result: AnalysisResult;
}

export interface BookingDetails {
  professionalId: string;
  customerName: string;
  phone: string;
  location: string;
  category: RenovationCategory;
  date: string;
  timeSlot: string;
  requirements: string;
  referenceNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}
