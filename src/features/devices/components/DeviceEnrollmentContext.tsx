// DeviceEnrollmentContext.tsx (Nuevo)
import { createContext, useContext, useState } from 'react';

type EnrollmentData = {
  deviceId?: number;
};

type EnrollmentContextType = {
  step: 'scan' | 'summary' | 'success';
  data: EnrollmentData;
  setStep: (step: 'scan' | 'summary' | 'success') => void;
  updateData: (newData: EnrollmentData) => void;
};

const EnrollmentContext = createContext<EnrollmentContextType>({} as EnrollmentContextType);

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<'scan' | 'summary' | 'success'>('scan');
  const [data, setData] = useState<EnrollmentData>({});

  const updateData = (newData: EnrollmentData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <EnrollmentContext.Provider value={{ step, setStep, data, updateData }}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => useContext(EnrollmentContext);