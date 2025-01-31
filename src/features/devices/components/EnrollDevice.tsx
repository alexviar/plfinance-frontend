import { useEffect, useState } from 'react'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import { LuCircleCheck, LuCircleX, LuSmartphone } from 'react-icons/lu'
import { useLazyGetPurchaseQuery } from '../../purchases/purchasesApi'
import { useEnrollDeviceMutation } from '../devicesApi'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../../../commons/api/getErrorMessage'

export const EnrollDevice = () => {
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [enrollDevice, enrollDeviceResult] = useEnrollDeviceMutation()

  useEffect(() => {
    (window as any).registerDevice = async (purchaseId: number, pushToken: string) => {
      try {
        await enrollDevice({
          purchaseId,
          pushToken
        }).unwrap()
        localStorage.setItem('enrolled', String(true))
        navigate('/', { replace: true })
      } catch { }
    }
    return () => {
      delete (window as any).sendNotificationToken
    }
  }, [])

  const [getPurchase, _] = useLazyGetPurchaseQuery()

  const handleScan = async (result: IDetectedBarcode[]) => {
    setSuccess(true)
    try {

      if (result[0] && (window as any).ReactNativeWebView) {
        const parsedData = JSON.parse(result[0].rawValue)

        const purchase = await getPurchase(parsedData['android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE'].purchaseId as number).unwrap();

        if (purchase.paymentPlan) {
          (window as any).ReactNativeWebView.postMessage(JSON.stringify({
            event: 'installments_received',
            payload: purchase.paymentPlan?.installments.map((item) => ({
              dueDate: item.dueDate,
              status: item.status
            }))
          }));
        }
      }
    }
    catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-[#171717]">Registrar Dispositivo</h1>
        <p className="text-neutral-500 mt-2">Escanea el código QR de la venta</p>
      </div>

      {enrollDeviceResult.isError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {getErrorMessage(enrollDeviceResult.error)}
        </div>
      )}

      {/* Contenedor del escáner */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200">
        <div className="relative aspect-square">

          <Scanner
            onScan={handleScan}
            onError={(error) => {
              setError((error as any)?.message)
            }}
          />

          {/* Estado: Escaneo exitoso */}
          {success && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 animate-fadeIn">
              <LuCircleCheck className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-white text-lg font-medium text-center">
                Codigo escaneado exitosamente!
              </p>
            </div>
          )}

          {/* Estado: Error */}
          {error && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 animate-fadeIn">
              <LuCircleX className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-white text-lg font-medium text-center mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                }}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="max-w-3xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl bg-neutral-300">
        <div className="flex items-center gap-5 mb-8">
          <div className="p-3.5 bg-gradient-to-br from-neutral-700 to-[#171717] rounded-xl shadow-lg">
            <LuSmartphone className="w-8 h-8 text-gray-200" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gray-900 bg-clip-text text-transparent">
              Guía rápida
            </h3>
            <p className="text-neutral-800 mt-1">Pasos para registrar el dispositivo</p>
          </div>
        </div>

        <ol className="space-y-5 pl-5 border-l-2 border-gray-400/40">
          {[
            'Abre la aplicación en el dispositivo del vendedor',
            'En la lista de ventas, selecciona la venta correspondiente',
            'Enfoca la cámara hacia el código QR en pantalla'
          ].map((step, index) => (
            <li key={index} className="flex gap-4 items-start">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-700/10 text-gray-700 rounded-full mt-1">
                {index + 1}
              </div>
              <p className="text-neutral-900 leading-relaxed flex-1">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
