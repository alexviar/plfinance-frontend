import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { LuQrCode, LuCircleAlert, LuCircleX } from 'react-icons/lu';
import { useEnrollment } from './DeviceEnrollmentContext';
import { useState } from 'react';

export const QRScanStep = () => {
  const { setStep, updateData } = useEnrollment();
  const [error, setError] = useState<string>();

  const handleScan = async (result: IDetectedBarcode[]) => {
    try {
      if (!result[0]) {
        setError("No qr data found")
        return
      }
      const parsedData = JSON.parse(result[0].rawValue)
      const deviceId = parsedData['android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE'].deviceId
      if (!deviceId) {
        setError("Código QR inválido")
        return
      }
      updateData({
        deviceId
      })
      setStep('summary')
    } catch (e) {
      setError("Código QR inválido.")
    }
  };

  return (
    <div className="text-center">
      <LuQrCode className="w-12 h-12 mx-auto text-[#171717] mb-4" />
      <h2 className="text-xl font-bold text-[#171717] mb-2">Escanea Código QR</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <LuCircleAlert className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="relative bg-black rounded-xl overflow-hidden aspect-square">
        <Scanner
          onScan={handleScan}
          onError={(error: any) => setError(error.message)}
          constraints={{
            aspectRatio: 1
          }}
          styles={{
            container: {
              width: '100%',
              height: '100%',
              position: 'relative'
            },
            video: {
              objectFit: 'cover'
            }
          }}
        />

        {/* Estado: Error */}
        {error && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 animate-fadeIn">
            <LuCircleX className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-white text-lg font-medium text-center mb-4">{error}</p>
            <button
              onClick={() => {
                setError('')
              }}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      <p className="text-neutral-600 mt-4 text-sm px-4">
        Enfoque el código QR dentro del marco para escanear automáticamente
      </p>
    </div>
  );
};