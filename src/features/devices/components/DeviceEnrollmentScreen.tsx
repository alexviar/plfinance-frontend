import { EnrollmentProvider } from './DeviceEnrollmentContext';
import { DeviceEnrollmentFlow } from './DeviceEnrollmentFlow';

export const DeviceEnrollmentScreen = () => {

  return (
    <EnrollmentProvider>
      <DeviceEnrollmentFlow />
    </EnrollmentProvider>
  );
};