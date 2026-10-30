export type Language = 'en' | 'hi';
export type UserRole = 'artisan' | 'admin';

export interface User {
  id: string;
  name: string;
  hindiName: string;
  phone: string;
  role: UserRole;
  artisanId?: string;
  avatarUrl?: string;
  preferredLanguage: Language;
}

export interface Artisan {
  id: string;
  artisanCode: string; // e.g. "KRG-MUM-01"
  name: string;
  hindiName: string;
  city: 'Mumbai' | 'Delhi';
  area: string;
  ngoPartner: 'SEWA Delhi' | 'Shakti Foundation Mumbai';
  joiningDate: string;
  phone: string;
  status: 'active' | 'inactive';
  totalCompletedOrders: number;
  recordedHours: number;
  monthlyEarnings: number;
  // Impact analytics & baseline metrics
  baselineMonthlyIncome: number; // Income before joining Karigari in INR
  currentMonthlyIncome: number; // Current verified income in INR
  bankAccountActive: boolean;
  financialConfidenceScore: number; // 1 to 5 scale
  householdDecisionMaking: 'independent' | 'joint' | 'dependent';
  skills: string[];
  photoUrl: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  category: 'Pouch' | 'Laptop Sleeve' | 'Tote Bag' | 'Clutch';
  pieceRate: number; // Piece-rate compensation per finished unit
  description: string;
  hindiDescription: string;
  imageUrl: string;
  estimatedHoursPerUnit: number;
  requiredMaterials: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productHindiName: string;
  productCategory: string;
  artisanId: string;
  artisanName: string;
  assignedQty: number;
  completedQty: number;
  deadline: string;
  priority: 'urgent' | 'high' | 'medium' | 'normal';
  status: 'not_started' | 'in_progress' | 'completed';
  paymentStatus: 'pending' | 'calculated' | 'approved' | 'paid';
  pieceRate: number;
  requiredMaterials: string;
  hindiMaterials: string;
  instructions: string;
  hindiInstructions: string;
  proofUrl?: string;
  proofNotes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface WorkingHourEntry {
  id: string;
  artisanId: string;
  artisanName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  breakMinutes: number;
  orderId?: string;
  orderNumber?: string;
  notes?: string;
  status: 'submitted' | 'approved' | 'rejected';
  reviewerNotes?: string;
  submittedAt: string;
}

export interface EarningRecord {
  id: string;
  artisanId: string;
  artisanName: string;
  orderId?: string;
  orderNumber?: string;
  type: 'piece_rate' | 'hourly';
  amount: number;
  status: 'calculated' | 'approved' | 'paid';
  description: string;
  hindiDescription: string;
  date: string;
  paidDate?: string;
  paymentRef?: string;
}

export interface Material {
  id: string;
  name: string;
  hindiName: string;
  unit: string;
  inStock: number;
  minThreshold: number;
  category: string;
}

export interface MaterialRequest {
  id: string;
  artisanId: string;
  artisanName: string;
  materialId: string;
  materialName: string;
  requestedQty: number;
  unit: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: string;
  updatedDate?: string;
}

export interface SurveyQuestionOption {
  label: string;
  hindiLabel: string;
  value: string | number;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  hindiText: string;
  type: 'stars' | 'yes_no' | 'single_choice' | 'number' | 'text';
  options?: SurveyQuestionOption[];
  required: boolean;
  category: 'economic' | 'wellbeing' | 'skills' | 'working_conditions';
  helpText?: string;
  hindiHelpText?: string;
}

export interface Survey {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  hindiDescription: string;
  type: 'baseline' | 'followup' | 'monthly_checkin';
  questions: SurveyQuestion[];
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  artisanId: string;
  artisanName: string;
  answers: Record<string, any>;
  submittedAt: string;
}

export type DateFilterOption = '7d' | '30d' | 'this_month' | 'last_month' | 'all';
