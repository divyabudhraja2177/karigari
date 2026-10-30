import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Artisan,
  Product,
  Order,
  WorkingHourEntry,
  EarningRecord,
  Material,
  MaterialRequest,
  Survey,
  SurveyResponse,
  Language
} from '../types';
import {
  initialArtisans,
  initialProducts,
  initialOrders,
  initialHours,
  initialEarnings,
  initialMaterials,
  initialMaterialRequests,
  initialSurveys,
  initialSurveyResponses,
  demoUsers
} from '../data/mockData';
import { translations } from '../i18n/translations';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  hasPassedWelcome: boolean;
  setHasPassedWelcome: (val: boolean) => void;
  currentTab: 'home' | 'orders' | 'earnings' | 'hours' | 'materials' | 'surveys' | 'profile' | 'impact';
  setCurrentTab: (tab: 'home' | 'orders' | 'earnings' | 'hours' | 'materials' | 'surveys' | 'profile' | 'impact') => void;

  artisans: Artisan[];
  products: Product[];
  orders: Order[];
  workingHours: WorkingHourEntry[];
  earnings: EarningRecord[];
  materials: Material[];
  materialRequests: MaterialRequest[];
  surveys: Survey[];
  surveyResponses: SurveyResponse[];

  cityFilter: string;
  setCityFilter: (city: string) => void;
  ngoFilter: string;
  setNgoFilter: (ngo: string) => void;

  updateOrderProgress: (orderId: string, completedQty: number, proofNotes?: string, proofUrl?: string) => boolean;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  logWorkingHours: (entry: Omit<WorkingHourEntry, 'id' | 'submittedAt' | 'status'>) => { success: boolean; error?: string };
  createMaterialRequest: (materialId: string, requestedQty: number, reason?: string) => void;
  submitSurveyAnswers: (surveyId: string, answers: Record<string, any>) => boolean;

  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');
  const [currentUser, setCurrentUser] = useState<User>(demoUsers[0]);
  const [hasPassedWelcome, setHasPassedWelcome] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'orders' | 'earnings' | 'hours' | 'materials' | 'surveys' | 'profile' | 'impact'>('home');

  const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
  const [products] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [workingHours, setWorkingHours] = useState<WorkingHourEntry[]>(initialHours);
  const [earnings, setEarnings] = useState<EarningRecord[]>(initialEarnings);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(initialMaterialRequests);
  const [surveys] = useState<Survey[]>(initialSurveys);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>(initialSurveyResponses);

  const [cityFilter, setCityFilter] = useState<string>('all');
  const [ngoFilter, setNgoFilter] = useState<string>('all');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const t = translations[language] || translations.hi;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const updateOrderProgress = (
    orderId: string,
    completedQty: number,
    proofNotes?: string,
    proofUrl?: string
  ): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    if (completedQty < 0 || completedQty > order.assignedQty) {
      showToast(language === 'hi' ? 'संख्या मान्य नहीं है' : 'Invalid quantity', 'error');
      return false;
    }

    const isFullyCompleted = completedQty === order.assignedQty;
    const newStatus = isFullyCompleted ? 'completed' : completedQty > 0 ? 'in_progress' : 'not_started';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            completedQty,
            status: newStatus,
            proofNotes: proofNotes || o.proofNotes,
            proofUrl: proofUrl || o.proofUrl,
            completedAt: isFullyCompleted ? new Date().toISOString().split('T')[0] : o.completedAt
          };
        }
        return o;
      })
    );

    if (isFullyCompleted && order.status !== 'completed') {
      const earnedAmount = order.assignedQty * order.pieceRate;
      const newEarning: EarningRecord = {
        id: `earn-${Date.now()}`,
        artisanId: order.artisanId,
        artisanName: order.artisanName,
        orderId: order.id,
        orderNumber: order.orderNumber,
        type: 'piece_rate',
        amount: earnedAmount,
        status: 'calculated',
        description: `${order.assignedQty} × ${order.productName} (Piece-rate @ ₹${order.pieceRate})`,
        hindiDescription: `${order.assignedQty} × ${order.productHindiName} (प्रति नग ₹${order.pieceRate})`,
        date: new Date().toISOString().split('T')[0]
      };
      setEarnings((prev) => [newEarning, ...prev]);

      setArtisans((prev) =>
        prev.map((a) =>
          a.id === order.artisanId
            ? { ...a, totalCompletedOrders: a.totalCompletedOrders + 1 }
            : a
        )
      );
    }

    showToast(
      isFullyCompleted
        ? (language === 'hi' ? 'ऑर्डर पूरा हुआ! बधाई।' : 'Order marked complete!')
        : (language === 'hi' ? 'प्रगति अपडेट की गई' : 'Progress updated'),
      'success'
    );
    return true;
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let targetQty = order.completedQty;
    if (newStatus === 'completed') {
      targetQty = order.assignedQty;
    } else if (newStatus === 'not_started') {
      targetQty = 0;
    } else if (newStatus === 'in_progress') {
      if (targetQty === 0) targetQty = 1;
      else if (targetQty >= order.assignedQty) targetQty = Math.max(1, order.assignedQty - 1);
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            completedQty: targetQty,
            completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return o;
      })
    );

    if (newStatus === 'completed' && order.status !== 'completed') {
      const earnedAmount = order.assignedQty * order.pieceRate;
      const newEarning: EarningRecord = {
        id: `earn-${Date.now()}`,
        artisanId: order.artisanId,
        artisanName: order.artisanName,
        orderId: order.id,
        orderNumber: order.orderNumber,
        type: 'piece_rate',
        amount: earnedAmount,
        status: 'calculated',
        description: `${order.assignedQty} × ${order.productName} (Piece-rate @ ₹${order.pieceRate})`,
        hindiDescription: `${order.assignedQty} × ${order.productHindiName} (प्रति नग ₹${order.pieceRate})`,
        date: new Date().toISOString().split('T')[0]
      };
      setEarnings((prev) => [newEarning, ...prev]);

      setArtisans((prev) =>
        prev.map((a) =>
          a.id === order.artisanId
            ? { ...a, totalCompletedOrders: a.totalCompletedOrders + 1 }
            : a
        )
      );
    }

    const messages = {
      not_started: language === 'hi' ? 'ऑर्डर "शुरू नहीं हुआ" चिह्नित किया गया' : 'Order marked as Not Started',
      in_progress: language === 'hi' ? 'ऑर्डर "प्रगति पर" चिह्नित किया गया' : 'Order marked as In Progress',
      completed: language === 'hi' ? 'ऑर्डर पूरा हुआ! बधाई।' : 'Order completed!'
    };
    showToast(messages[newStatus], 'success');
  };

  const logWorkingHours = (entry: Omit<WorkingHourEntry, 'id' | 'submittedAt' | 'status'>) => {
    if (entry.durationHours <= 0) {
      return { success: false, error: language === 'hi' ? 'समय 0 से अधिक होना चाहिए' : 'Hours must be > 0' };
    }

    const newEntry: WorkingHourEntry = {
      ...entry,
      id: `hr-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'approved'
    };

    setWorkingHours((prev) => [newEntry, ...prev]);

    setArtisans((prev) =>
      prev.map((a) =>
        a.id === entry.artisanId
          ? { ...a, recordedHours: a.recordedHours + entry.durationHours }
          : a
      )
    );

    showToast(
      language === 'hi'
        ? `${entry.durationHours} घंटे का कार्य दर्ज हुआ`
        : `Logged ${entry.durationHours} hours`,
      'success'
    );
    return { success: true };
  };

  const createMaterialRequest = (materialId: string, requestedQty: number, reason?: string) => {
    const mat = materials.find((m) => m.id === materialId);
    if (!mat) return;

    const newReq: MaterialRequest = {
      id: `req-${Date.now()}`,
      artisanId: currentUser.artisanId || 'art-1',
      artisanName: currentUser.name,
      materialId: mat.id,
      materialName: mat.name,
      requestedQty,
      unit: mat.unit,
      reason: reason || 'Urgent requirement for handicraft order batch',
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    setMaterialRequests((prev) => [newReq, ...prev]);
    showToast(
      language === 'hi'
        ? `सामग्री मांग दर्ज हुई: ${requestedQty} ${mat.unit}`
        : `Requested ${requestedQty} ${mat.unit} of ${mat.name}`,
      'success'
    );
  };

  const submitSurveyAnswers = (surveyId: string, answers: Record<string, any>) => {
    const newResponse: SurveyResponse = {
      id: `resp-${Date.now()}`,
      surveyId,
      artisanId: currentUser.artisanId || 'art-1',
      artisanName: currentUser.name,
      answers,
      submittedAt: new Date().toISOString()
    };

    setSurveyResponses((prev) => [newResponse, ...prev]);
    showToast(
      language === 'hi' ? 'सर्वेक्षण सफलतापूर्वक जमा हुआ! धन्यवाद।' : 'Survey submitted! Thank you.',
      'success'
    );
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: demoUsers,
        language,
        setLanguage,
        t,
        hasPassedWelcome,
        setHasPassedWelcome,
        currentTab,
        setCurrentTab,
        artisans,
        products,
        orders,
        workingHours,
        earnings,
        materials,
        materialRequests,
        surveys,
        surveyResponses,
        cityFilter,
        setCityFilter,
        ngoFilter,
        setNgoFilter,
        updateOrderProgress,
        updateOrderStatus,
        logWorkingHours,
        createMaterialRequest,
        submitSurveyAnswers,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
