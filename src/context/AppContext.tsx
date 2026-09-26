import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Project, AnalysisState, AnalysisResult, RenovationCategory, BudgetCategory, PropertyType, Measurements, Preferences } from '../types';

// ------- AUTH CONTEXT -------
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ------- ANALYSIS CONTEXT -------
interface AnalysisContextType {
  state: AnalysisState;
  setCategory: (c: RenovationCategory) => void;
  setBudget: (b: BudgetCategory) => void;
  setPropertyType: (p: PropertyType) => void;
  setImages: (files: File[], urls: string[]) => void;
  setMeasurements: (m: Partial<Measurements>) => void;
  setPreferences: (p: Partial<Preferences>) => void;
  resetAnalysis: () => void;
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;
}

const defaultAnalysisState: AnalysisState = {
  category: null,
  budget: null,
  propertyType: null,
  uploadedImages: [],
  imagePreviewUrls: [],
  measurements: { unit: 'meters' },
  preferences: {},
};

const AnalysisContext = createContext<AnalysisContextType | null>(null);

// ------- PROJECTS CONTEXT -------
interface ProjectsContextType {
  projects: Project[];
  saveProject: (p: Project) => void;
  deleteProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

// ------- TOAST CONTEXT -------
export type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextType | null>(null);

// ------- LANGUAGE CONTEXT -------
type Language = 'en' | 'hi' | 'bn';
interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
}
const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.features': 'Features',
    'nav.professionals': 'Find Professionals',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': "What would you like to renovate today?",
    'analysis.step1': 'Select Category',
    'analysis.step2': 'Select Budget',
    'analysis.step3': 'Property Type',
    'analysis.step4': 'Upload & Measure',
    'analysis.step5': 'Preferences',
    'btn.analyzeSpace': 'Analyze My Space',
    'btn.startAnalysis': 'Start Free Analysis',
    'btn.bookProfessionals': 'Book Professionals',
    'btn.saveProject': 'Save to My Projects',
    'btn.downloadReport': 'Download PDF Report',
    'toast.projectSaved': 'Project saved successfully!',
    'toast.loginSuccess': 'Welcome back!',
    'toast.registerSuccess': 'Account created successfully!',
    'toast.bookingConfirmed': 'Booking confirmed!',
  },
  hi: {
    'nav.home': 'होम',
    'nav.howItWorks': 'यह कैसे काम करता है',
    'nav.features': 'विशेषताएं',
    'nav.professionals': 'पेशेवर खोजें',
    'nav.login': 'लॉगिन',
    'nav.getStarted': 'शुरू करें',
    'dashboard.welcome': 'वापस स्वागत है',
    'dashboard.subtitle': 'आज आप क्या नवीनीकरण करना चाहेंगे?',
    'analysis.step1': 'श्रेणी चुनें',
    'analysis.step2': 'बजट चुनें',
    'analysis.step3': 'संपत्ति प्रकार',
    'analysis.step4': 'अपलोड करें',
    'analysis.step5': 'प्राथमिकताएं',
    'btn.analyzeSpace': 'मेरी जगह का विश्लेषण करें',
    'btn.startAnalysis': 'मुफ्त विश्लेषण शुरू करें',
    'btn.bookProfessionals': 'पेशेवरों को बुक करें',
    'btn.saveProject': 'मेरे प्रोजेक्ट में सहेजें',
    'btn.downloadReport': 'PDF रिपोर्ट डाउनलोड करें',
    'toast.projectSaved': 'प्रोजेक्ट सफलतापूर्वक सहेजा गया!',
    'toast.loginSuccess': 'वापस स्वागत है!',
    'toast.registerSuccess': 'खाता सफलतापूर्वक बनाया गया!',
    'toast.bookingConfirmed': 'बुकिंग की पुष्टि हो गई!',
  },
  bn: {
    'nav.home': 'হোম',
    'nav.howItWorks': 'এটি কীভাবে কাজ করে',
    'nav.features': 'বৈশিষ্ট্য',
    'nav.professionals': 'পেশাদার খুঁজুন',
    'nav.login': 'লগইন',
    'nav.getStarted': 'শুরু করুন',
    'dashboard.welcome': 'ফিরে স্বাগতম',
    'dashboard.subtitle': 'আজ আপনি কী নবায়ন করতে চান?',
    'analysis.step1': 'বিভাগ বাছুন',
    'analysis.step2': 'বাজেট বাছুন',
    'analysis.step3': 'সম্পত্তির ধরন',
    'analysis.step4': 'আপলোড করুন',
    'analysis.step5': 'পছন্দ',
    'btn.analyzeSpace': 'আমার স্থান বিশ্লেষণ করুন',
    'btn.startAnalysis': 'বিনামূল্যে বিশ্লেষণ শুরু করুন',
    'btn.bookProfessionals': 'পেশাদার বুক করুন',
    'btn.saveProject': 'আমার প্রকল্পে সংরক্ষণ করুন',
    'btn.downloadReport': 'PDF রিপোর্ট ডাউনলোড করুন',
    'toast.projectSaved': 'প্রকল্প সফলভাবে সংরক্ষিত হয়েছে!',
    'toast.loginSuccess': 'ফিরে স্বাগতম!',
    'toast.registerSuccess': 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!',
    'toast.bookingConfirmed': 'বুকিং নিশ্চিত হয়েছে!',
  },
};

// ------- PROVIDER -------
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('renoai_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setAuthLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const mockUser: User = { id: 'u1', name: email.split('@')[0].replace('.', ' '), email };
    localStorage.setItem('renoai_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setAuthLoading(false);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, _password: string): Promise<boolean> => {
    setAuthLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const mockUser: User = { id: 'u1', name, email, phone };
    localStorage.setItem('renoai_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setAuthLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('renoai_user');
    setUser(null);
  }, []);

  // Analysis
  const [analysisState, setAnalysisState] = useState<AnalysisState>(defaultAnalysisState);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const setCategory = useCallback((c: RenovationCategory) => setAnalysisState(s => ({ ...s, category: c })), []);
  const setBudget = useCallback((b: BudgetCategory) => setAnalysisState(s => ({ ...s, budget: b })), []);
  const setPropertyType = useCallback((p: PropertyType) => setAnalysisState(s => ({ ...s, propertyType: p })), []);
  const setImages = useCallback((files: File[], urls: string[]) => setAnalysisState(s => ({ ...s, uploadedImages: files, imagePreviewUrls: urls })), []);
  const setMeasurements = useCallback((m: Partial<Measurements>) => setAnalysisState(s => ({ ...s, measurements: { ...s.measurements, ...m } })), []);
  const setPreferences = useCallback((p: Partial<Preferences>) => setAnalysisState(s => ({ ...s, preferences: { ...s.preferences, ...p } })), []);
  const resetAnalysis = useCallback(() => { setAnalysisState(defaultAnalysisState); setResult(null); }, []);

  // Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('renoai_projects');
    return stored ? JSON.parse(stored) : [];
  });

  const saveProject = useCallback((p: Project) => {
    setProjects(prev => {
      const updated = [p, ...prev.filter(x => x.id !== p.id)];
      localStorage.setItem('renoai_projects', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => {
      const updated = prev.filter(x => x.id !== id);
      localStorage.setItem('renoai_projects', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // Language
  const [language, setLanguage] = useState<Language>('en');
  const t = useCallback((key: string) => translations[language][key] || translations['en'][key] || key, [language]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading: authLoading }}>
      <AnalysisContext.Provider value={{ state: analysisState, setCategory, setBudget, setPropertyType, setImages, setMeasurements, setPreferences, resetAnalysis, result, setResult }}>
        <ProjectsContext.Provider value={{ projects, saveProject, deleteProject }}>
          <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            <LanguageContext.Provider value={{ language, setLanguage, t }}>
              {children}
            </LanguageContext.Provider>
          </ToastContext.Provider>
        </ProjectsContext.Provider>
      </AnalysisContext.Provider>
    </AuthContext.Provider>
  );
};

// ------- HOOKS -------
export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('useAuth outside provider'); return c; };
export const useAnalysis = () => { const c = useContext(AnalysisContext); if (!c) throw new Error('useAnalysis outside provider'); return c; };
export const useProjects = () => { const c = useContext(ProjectsContext); if (!c) throw new Error('useProjects outside provider'); return c; };
export const useToast = () => { const c = useContext(ToastContext); if (!c) throw new Error('useToast outside provider'); return c; };
export const useLang = () => { const c = useContext(LanguageContext); if (!c) throw new Error('useLang outside provider'); return c; };
