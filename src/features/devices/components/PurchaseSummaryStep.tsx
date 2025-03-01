
import { LuClipboardList, LuCircleAlert, LuSmartphone, LuCalendar, LuUser, LuDollarSign, LuFileText, LuLoaderCircle } from 'react-icons/lu';
import { useEnrollment } from './DeviceEnrollmentContext';
import { getErrorMessage } from '../../../commons/api/getErrorMessage';
import { InstallmentStatuses, InstallmentStatusesMap } from '../../purchases/purchasesApi';
import { useEffect } from 'react';
import { useGetDeviceQuery, useUpdatePushTokenMutation } from '../devicesApi';

export const PurchaseSummaryStep = () => {
  const { data, setStep } = useEnrollment();
  const getDevice = useGetDeviceQuery(data.deviceId!);
  const device = getDevice.currentData
  const purchase = device?.purchase;
  const paymentPlan = purchase?.paymentPlan;

  const [updatePushToken, updatePushTokenResult] = useUpdatePushTokenMutation()

  useEffect(() => {
    if (device) {
      const remove = window.addNativeCommandHandler?.(async (cmd) => {
        if (cmd.type === 'finish_device_enrollment') {
          cmd.payload.token && (await updatePushToken({
            id: device.id,
            pushToken: cmd.payload.token
          }).unwrap())
          setStep('success')
          localStorage.setItem('deviceId', String(device.id))
        }
      })
      return remove
    }
  }, [device])

  if (getDevice.isLoading) {
    return (
      <SkeletonLoader />
    );
  }

  if (getDevice.isError) {
    return (
      <div className="text-center space-y-6 p-4">
        <div className="inline-flex bg-red-100 p-4 rounded-full">
          <LuCircleAlert className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-[#171717]">Error en la consulta</h2>
        <p className="text-neutral-600 mb-6">{getErrorMessage(getDevice.error)}</p>
      </div>
    );
  }

  if (updatePushTokenResult.isLoading) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex">
          <LuLoaderCircle className="animate-spin w-16 h-16" />
        </div>
        <p>Registrando...</p>
      </div>
    );
  }

  if (updatePushTokenResult.isError) {
    return (
      <div className="text-center space-y-6 p-4">
        <div className="inline-flex bg-red-100 p-4 rounded-full">
          <LuCircleAlert className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-[#171717]">Error al actualizar token push</h2>
        <p className="text-neutral-600 mb-6">{getErrorMessage(updatePushTokenResult.error)}</p>
      </div>
    );
  }

  function enrollDevice() {
    window.ReactNativeWebView?.postMessage(JSON.stringify({
      event: 'enroll_device',
      payload: {
        deviceId: device!.id,
        installments: purchase!.paymentPlan?.installments
          .filter(({ status }) => status == InstallmentStatuses.Pending || status == InstallmentStatuses.Current)
          .map((item) => ({
            id: item.id,
            dueDate: String((new Date(item.dueDate)).getTime()),
          }))
      }
    }));

    console.log("Payload", {
      deviceId: device!.id,
      installments: purchase!.paymentPlan?.installments
        .filter(({ status }) => status == InstallmentStatuses.Pending || status == InstallmentStatuses.Current)
        .map((item) => ({
          id: item.id,
          dueDate: item.dueDate,
        }))
    }, purchase!.paymentPlan?.installments)
  }

  const handleContinue = async () => {
    enrollDevice()
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex bg-[#171717] p-3 rounded-2xl">
          <LuClipboardList className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#171717] mt-4 mb-2">Resumen del crédito</h2>
        <p className="text-neutral-600">Verifica los detalles antes de continuar</p>
      </div>

      {/* Tarjeta de información principal */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="col-span-2 flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
            <LuSmartphone className="w-6 h-6 text-[#171717]" />
            <div>
              <p className="text-xs text-neutral-500">Dispositivo</p>
              <p className="font-medium">{device!.name || 'No registrado'}</p>
              <p className="text-xs text-neutral-500">{device!.serialNumber || 'IMEI no disponible'}</p>
            </div>
          </div>

          <InfoItem
            icon={<LuUser className="w-5 h-5" />}
            label="Cliente"
            value={purchase!.customer}
          />

          <InfoItem
            icon={<LuCalendar className="w-5 h-5" />}
            label="Fecha de compra"
            value={new Date(purchase!.purchaseDate).toLocaleDateString()}
          />

          <InfoItem
            icon={<LuDollarSign className="w-5 h-5" />}
            label="Monto total"
            value={`MXN ${purchase!.amount.toLocaleString()}`}
          />

          <InfoItem
            icon={<LuFileText className="w-5 h-5" />}
            label="Cuotas"
            value={`${paymentPlan!.installments.length} pagos`}
          />
        </div>
      </div>

      {/* Timeline de pagos */}
      <div className="bg-white rounded-xl shadow-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <LuCalendar className="w-5 h-5 text-[#171717]" />
          Plan de pagos
        </h3>

        <div className="space-y-3">
          {paymentPlan!.installments.map((installment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">MXN {installment.amount.toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(installment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <InstallmentStatusBadge status={installment.status} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-[#171717] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 active:scale-[98%] transition-all"
      >
        Confirmar registro
      </button>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="p-3 bg-neutral-50 rounded-lg">
    <div className='flex items-center gap-2 mb-1'>
      <div className="text-[#171717]">{icon}</div>
      <h4 className="text-xs text-neutral-500">{label}</h4>
    </div>
    <p className="font-medium">{value}</p>
  </div>
);

export const InstallmentStatusBadge = ({ status }: { status: InstallmentStatuses }) => {
  const statusStyles = {
    [InstallmentStatuses.Paid]: 'bg-green-100 text-green-700',
    [InstallmentStatuses.Current]: 'bg-blue-100 text-blue-700',
    [InstallmentStatuses.PastDue]: 'bg-red-100 text-red-700',
    [InstallmentStatuses.Pending]: 'bg-amber-100 text-amber-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {InstallmentStatusesMap[status]}
    </span>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-6">
    {/* Encabezado */}
    <div className="text-center space-y-4">
      <div className="h-12 w-12 bg-neutral-200 rounded-2xl mx-auto animate-pulse" />
      <div className="h-4 bg-neutral-200 rounded w-1/3 mx-auto" />
      <div className="h-4 bg-neutral-200 rounded w-1/4 mx-auto" />
    </div>

    {/* Tarjeta de dispositivo */}
    <div className="bg-white rounded-xl shadow-card space-y-4">
      <div className="h-20 bg-neutral-100 rounded-lg p-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-neutral-100 rounded-lg p-3">
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>

    {/* Timeline de pagos */}
    <div className="bg-white rounded-xl shadow-card space-y-4">
      <div className="h-6 bg-neutral-200 rounded w-1/4 animate-pulse" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 bg-neutral-100 rounded-lg animate-pulse" />
      ))}
    </div>

    <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
  </div>
);

