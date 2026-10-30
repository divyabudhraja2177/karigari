import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  Language,
  DateFilterOption
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

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Auth & User
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  
  // Navigation & View
  viewMode: 'artisan' | 'admin';
  setViewMode: (mode: 'artisan' | 'admin') => void;
  artisanTab: 'home' | 'orders' | 'earnings' | 'hours' | 'materials' | 'surveys' | 'profile' | 'impact';
  setArtisanTab: (tab: 'home' | 'orders' | 'earnings' | 'hours' | 'materials' | 'surveys' | 'profile' | 'impact') => void;
  adminTab: 'overview' | 'artisans' | 'impact' | 'orders' | 'timesheets' | 'payments' | 'inventory' | 'reports';
  setAdminTab: (tab: 'overview' | 'artisans' | 'impact' | 'orders' | 'timesheets' | 'payments' | 'inventory' | 'reports') => void;
  isSimulatedDevice: boolean;
  setIsSimulatedDevice: (val: boolean) => void;
  hasPassedWelcome: boolean;
  setHasPassedWelcome: (val: boolean) => void;

  // Domain Data
  artisans: Artisan[];
  products: Product[];
  orders: Order[];
  workingHours: WorkingHourEntry[];
  earnings: EarningRecord[];
  materials: Material[];
  materialRequests: MaterialRequest[];
  surveys: Survey[];
  surveyResponses: SurveyResponse[];

  // Admin Filters
  dateFilter: DateFilterOption;
  setDateFilter: (filter: DateFilterOption) => void;
  ngoFilter: string;
  setNgoFilter: (ngo: string) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;

  // Actions
  updateOrderProgress: (orderId: string, completedQty: number, proofNotes?: string, proofUrl?: string) => boolean;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
  logWorkingHours: (entry: Omit<WorkingHourEntry, 'id' | 'submittedAt' | 'status'>) => { success: boolean; error?: string };
  approveWorkingHours: (id: string, notes?: string) => void;
  rejectWorkingHours: (id: string, notes?: string) => void;
  createMaterialRequest: (materialId: string, requestedQty: number, reason?: string) => void;
  updateMaterialRequestStatus: (id: string, status: MaterialRequest['status']) => void;
  submitSurveyAnswers: (surveyId: string, answers: Record<string, any>) => boolean;
  approveEarning: (id: string) => void;
  markEarningPaid: (id: string, paymentRef: string) => void;
  addArtisan: (artisan: Omit<Artisan, 'id' | 'artisanCode' | 'totalCompletedOrders' | 'recordedHours' | 'monthlyEarnings'>) => void;
  resetAllData: () => void;

  // UI Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'karigari_user',
  LANGUAGE: 'karigari_lang',
  ARTISANS: 'karigari_artisans_v2',
  ORDERS: 'karigari_orders_v2',
  HOURS: 'karigari_hours_v2',
  EARNINGS: 'karigari_earnings_v2',
  MATERIALS: 'karigari_materials_v2',
  REQUESTS: 'karigari_requests_v2',
  RESPONSES: 'karigari_responses_v2',
  PASSED_WELCOME: 'karigari_passed_welcome'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language & User
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'hi';
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return demoUsers[0]; // Sunita Sharma (Artisan)
  });

  const [hasPassedWelcome, setHasPassedWelcomeState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.PASSED_WELCOME) === 'true';
  });

  // Views & navigation
  const [viewMode, setViewMode] = useState<'artisan' | 'admin'>(currentUser.role === 'admin' ? 'admin' : 'artisan');
  const [artisanTab, setArtisanTab] = useState<'home' | 'orders' | 'earnings' | 'hours' | 'materials' | 'surveys' | 'profile' | 'impact'>('home');
  const [adminTab, setAdminTab] = useState<'overview' | 'artisans' | 'impact' | 'orders' | 'timesheets' | 'payments' | 'inventory' | 'reports'>('overview');
  const [isSimulatedDevice, setIsSimulatedDevice] = useState<boolean>(false);

  // Admin filters
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('30d');
  const [ngoFilter, setNgoFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Domain state with localStorage hydration
  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARTISANS);
    return saved ? JSON.parse(saved) : initialArtisans;
  });

  const [products] = useState<Product[]>(initialProducts);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [workingHours, setWorkingHours] = useState<WorkingHourEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOURS);
    return saved ? JSON.parse(saved) : initialHours;
  });

  const [earnings, setEarnings] = useState<EarningRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EARNINGS);
    return saved ? JSON.parse(saved) : initialEarnings;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : initialMaterialRequests;
  });

  const [surveys] = useState<Survey[]>(initialSurveys);

  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    return saved ? JSON.parse(saved) : initialSurveyResponses;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PASSED_WELCOME, String(hasPassedWelcome));
  }, [hasPassedWelcome]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTISANS, JSON.stringify(artisans));
  }, [artisans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOURS, JSON.stringify(workingHours));
  }, [workingHours]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EARNINGS, JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(materialRequests));
  }, [materialRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(surveyResponses));
  }, [surveyResponses]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    if (user.role === 'admin') {
      setViewMode('admin');
    } else {
      setViewMode('artisan');
      setArtisanTab('home');
    }
    showToast(
      language === 'hi' 
        ? `${user.hindiName || user.name} के रूप में सक्रिय` 
        : `Switched profile to ${user.name}`,
      'info'
    );
  };

  const setHasPassedWelcome = (val: boolean) => {
    setHasPassedWelcomeState(val);
  };

  // Action: Update Order Progress
  const updateOrderProgress = (orderId: string, completedQty: number, proofNotes?: string, proofUrl?: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    if (completedQty < 0) {
      showToast(language === 'hi' ? 'संख्या नकारात्मक नहीं हो सकती' : 'Quantity cannot be negative', 'error');
      return false;
    }
    if (completedQty > order.assignedQty) {
      showToast(
        language === 'hi'
          ? `संख्या सौंपी गई मात्रा (${order.assignedQty}) से अधिक नहीं हो सकती`
          : `Completed units cannot exceed assigned count (${order.assignedQty})`,
        'error'
      );
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

    // If fully completed, automatically record an earning entry (status: 'calculated')
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

      // Update artisan completed orders count
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
        : (language === 'hi' ? 'प्रगति सफलतापूर्वक अपडेट की गई' : 'Progress updated successfully'),
      'success'
    );
    return true;
  };

  // Action: Update Order Status Directly (Not Started, In Progress, Completed)
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
            completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : (newStatus === 'not_started' ? undefined : o.completedAt)
          };
        }
        return o;
      })
    );

    // If marked as completed and wasn't already completed, add earning
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

    const statusLabels = {
      not_started: language === 'hi' ? 'ऑर्डर को "शुरू नहीं हुआ" चिह्नित किया गया' : 'Order marked as Not Started',
      in_progress: language === 'hi' ? 'ऑर्डर को "प्रगति पर" चिह्नित किया गया' : 'Order marked as In Progress',
      completed: language === 'hi' ? 'ऑर्डर पूरा हुआ! बधाई।' : 'Order marked as Completed!'
    };
    showToast(statusLabels[newStatus], 'success');
  };

  // Action: Create Order (Admin)
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newId = `ord-${Date.now()}`;
    const orderNumber = `KRG-ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(language === 'hi' ? `नया ऑर्डर ${orderNumber} बनाया गया` : `New order ${orderNumber} created`, 'success');
  };

  // Action: Log Working Hours (Artisan)
  const logWorkingHours = (entry: Omit<WorkingHourEntry, 'id' | 'submittedAt' | 'status'>) => {
    // Validation
    if (entry.durationHours <= 0) {
      return { success: false, error: language === 'hi' ? 'काम के घंटे 0 से अधिक होने चाहिए' : 'Working hours must be greater than 0' };
    }

    // Duplicate check: same artisan, same date, and within similar start time
    const isDuplicate = workingHours.some(
      (h) => h.artisanId === entry.artisanId && h.date === entry.date && h.startTime === entry.startTime
    );
    if (isDuplicate) {
      return {
        success: false,
        error: language === 'hi' ? 'आप इस समय के लिए पहले ही घंटे दर्ज कर चुकी हैं।' : 'An entry for this date and time already exists.'
      };
    }

    const newEntry: WorkingHourEntry = {
      ...entry,
      id: `hr-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    setWorkingHours((prev) => [newEntry, ...prev]);

    // Update artisan's total recorded hours
    setArtisans((prev) =>
      prev.map((a) =>
        a.id === entry.artisanId
          ? { ...a, recordedHours: Math.round((a.recordedHours + entry.durationHours) * 10) / 10 }
          : a
      )
    );

    showToast(
      language === 'hi'
        ? `${entry.durationHours} घंटे सफलतापूर्वक दर्ज किए गए!`
        : `${entry.durationHours} hours logged successfully!`,
      'success'
    );
    return { success: true };
  };

  // Action: Approve Working Hours (Admin)
  const approveWorkingHours = (id: string, notes?: string) => {
    setWorkingHours((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: 'approved', reviewerNotes: notes || 'Approved by Admin' } : h
      )
    );
    showToast(language === 'hi' ? 'घंटे स्वीकृत किए गए' : 'Timesheet approved', 'success');
  };

  // Action: Reject Working Hours (Admin)
  const rejectWorkingHours = (id: string, notes?: string) => {
    setWorkingHours((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: 'rejected', reviewerNotes: notes || 'Needs revision' } : h
      )
    );
    showToast(language === 'hi' ? 'घंटे अस्वीकृत किए गए' : 'Timesheet flagged for revision', 'info');
  };

  // Action: Create Material Request (Artisan)
  const createMaterialRequest = (materialId: string, requestedQty: number, reason?: string) => {
    const mat = materials.find((m) => m.id === materialId);
    if (!mat) return;

    const newReq: MaterialRequest = {
      id: `req-${Date.now()}`,
      artisanId: currentUser.artisanId || 'art-1',
      artisanName: currentUser.name,
      materialId,
      materialName: mat.name,
      requestedQty,
      unit: mat.unit,
      reason,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    setMaterialRequests((prev) => [newReq, ...prev]);
    showToast(
      language === 'hi'
        ? `${mat.hindiName} की मांग एनजीओ को भेजी गई`
        : `Material request for ${mat.name} submitted`,
      'success'
    );
  };

  // Action: Update Material Request Status (Admin)
  const updateMaterialRequestStatus = (id: string, status: MaterialRequest['status']) => {
    setMaterialRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          // If fulfilled, decrement available stock safely
          if (status === 'fulfilled' && r.status !== 'fulfilled') {
            setMaterials((mats) =>
              mats.map((m) =>
                m.id === r.materialId
                  ? { ...m, inStock: Math.max(0, m.inStock - r.requestedQty) }
                  : m
              )
            );
          }
          return { ...r, status, updatedDate: new Date().toISOString().split('T')[0] };
        }
        return r;
      })
    );
    showToast(language === 'hi' ? `अनुरोध स्थिति: ${status}` : `Request updated to ${status}`, 'success');
  };

  // Action: Submit Survey Answers (Artisan)
  const submitSurveyAnswers = (surveyId: string, answers: Record<string, any>): boolean => {
    const artisanId = currentUser.artisanId || 'art-1';
    // Check if already completed
    const existing = surveyResponses.find((r) => r.surveyId === surveyId && r.artisanId === artisanId);
    if (existing) {
      showToast(language === 'hi' ? 'आप यह सर्वेक्षण पहले ही भर चुकी हैं' : 'Survey already completed', 'info');
      return false;
    }

    const newResponse: SurveyResponse = {
      id: `resp-${Date.now()}`,
      surveyId,
      artisanId,
      artisanName: currentUser.name,
      answers,
      submittedAt: new Date().toISOString()
    };

    setSurveyResponses((prev) => [newResponse, ...prev]);

    // If survey was financial confidence or decision power, update artisan profile stats
    if (answers.q_income_confidence) {
      setArtisans((prev) =>
        prev.map((a) =>
          a.id === artisanId
            ? {
                ...a,
                financialConfidenceScore: Number(answers.q_income_confidence) || a.financialConfidenceScore,
                householdDecisionMaking: answers.q_decision_power || a.householdDecisionMaking
              }
            : a
        )
      );
    }

    showToast(
      language === 'hi'
        ? 'सर्वेक्षण सफलतापूर्वक दर्ज हुआ! धन्यवाद।'
        : 'Survey submitted successfully! Thank you.',
      'success'
    );
    return true;
  };

  // Action: Approve Earning (Admin)
  const approveEarning = (id: string) => {
    setEarnings((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'approved' } : e))
    );
    showToast(language === 'hi' ? 'भुगतान स्वीकृत किया गया' : 'Payment approved', 'success');
  };

  // Action: Mark Earning as Paid (Admin)
  const markEarningPaid = (id: string, paymentRef: string) => {
    const today = new Date().toISOString().split('T')[0];
    setEarnings((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'paid', paidDate: today, paymentRef } : e
      )
    );
    showToast(language === 'hi' ? 'भुगतान हस्तांतरित दर्ज किया गया' : 'Payment marked as paid', 'success');
  };

  // Action: Add Artisan (Admin)
  const addArtisan = (artisanData: Omit<Artisan, 'id' | 'artisanCode' | 'totalCompletedOrders' | 'recordedHours' | 'monthlyEarnings'>) => {
    const count = artisans.length + 1;
    const cityCode = artisanData.city === 'Mumbai' ? 'MUM' : 'DEL';
    const artisanCode = `KRG-${cityCode}-${count < 10 ? '0' + count : count}`;
    const newArtisan: Artisan = {
      ...artisanData,
      id: `art-${Date.now()}`,
      artisanCode,
      totalCompletedOrders: 0,
      recordedHours: 0,
      monthlyEarnings: 0
    };
    setArtisans((prev) => [...prev, newArtisan]);
    showToast(
      language === 'hi' ? `नया कारीगर ${newArtisan.hindiName} जोड़ा गया` : `Artisan ${newArtisan.name} registered`,
      'success'
    );
  };

  // Reset demo data
  const resetAllData = () => {
    localStorage.clear();
    setArtisans(initialArtisans);
    setOrders(initialOrders);
    setWorkingHours(initialHours);
    setEarnings(initialEarnings);
    setMaterials(initialMaterials);
    setMaterialRequests(initialMaterialRequests);
    setSurveyResponses(initialSurveyResponses);
    setCurrentUserState(demoUsers[0]);
    setViewMode('artisan');
    setArtisanTab('home');
    setHasPassedWelcomeState(false);
    showToast(language === 'hi' ? 'डेमो डेटा रीसेट किया गया' : 'Demo data reset successfully', 'info');
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: demoUsers,
        language,
        setLanguage,
        t,
        viewMode,
        setViewMode,
        artisanTab,
        setArtisanTab,
        adminTab,
        setAdminTab,
        isSimulatedDevice,
        setIsSimulatedDevice,
        hasPassedWelcome,
        setHasPassedWelcome,
        artisans,
        products,
        orders,
        workingHours,
        earnings,
        materials,
        materialRequests,
        surveys,
        surveyResponses,
        dateFilter,
        setDateFilter,
        ngoFilter,
        setNgoFilter,
        cityFilter,
        setCityFilter,
        updateOrderProgress,
        updateOrderStatus,
        createOrder,
        logWorkingHours,
        approveWorkingHours,
        rejectWorkingHours,
        createMaterialRequest,
        updateMaterialRequestStatus,
        submitSurveyAnswers,
        approveEarning,
        markEarningPaid,
        addArtisan,
        resetAllData,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
