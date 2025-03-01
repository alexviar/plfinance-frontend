import { useEnrollment } from './DeviceEnrollmentContext';
import { QRScanStep } from './QRScanStep';
import { EnrollmentSuccessStep } from './DeviceEnrollmentSuccessStep';
import { PurchaseSummaryStep } from './PurchaseSummaryStep';

export const DeviceEnrollmentFlow = () => {
  const { step, ...rest } = useEnrollment();
  console.log("Step", step, rest)

  return (
    <div className="bg-white rounded-2xl w-full max-w-md p-4 relative">

      {/* Stepper */}
      <div className="mb-6 flex justify-center space-x-4">
        {['scan', 'summary', 'success'].map((s, index) => (
          <div
            key={s}
            className={`h-1 w-8 rounded-full ${step === s
              ? 'bg-[#171717]'
              : index < ['scan', 'summary', 'success'].indexOf(step)
                ? 'bg-[#171717]'
                : 'bg-neutral-200'
              }`}
          />
        ))}
      </div>

      {step === 'scan' && <QRScanStep />}
      {step === 'summary' && <PurchaseSummaryStep />}
      {step === 'success' && <EnrollmentSuccessStep />}
    </div>
  );
};