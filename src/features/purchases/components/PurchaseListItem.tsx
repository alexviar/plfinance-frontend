import { LuCalendar, LuCheck, LuClock, LuLock, LuLockOpen, LuSmartphone, LuTrash } from "react-icons/lu";
import { InstallmentStatuses, InstallmentStatusesMap, Purchase } from "../purchasesApi";
import { FaChevronDown, FaExclamationTriangle } from "react-icons/fa";
import QRCode from "react-qr-code";

type Props = {
  item: Purchase
  isExpanded: boolean
  onClick(): void
}

export const PurchaseListItem = ({ item, isExpanded, onClick }: Props) => {
  const { device } = item

  const getStatusStyles = (status: InstallmentStatuses) => {
    const styles = {
      [InstallmentStatuses.Paid]: { bg: 'bg-green-100', text: 'text-green-700', icon: LuCheck },
      [InstallmentStatuses.Current]: { bg: 'bg-blue-100', text: 'text-blue-700', icon: LuClock },
      [InstallmentStatuses.PastDue]: { bg: 'bg-red-100', text: 'text-red-700', icon: FaExclamationTriangle },
      [InstallmentStatuses.Pending]: { bg: 'bg-amber-100', text: 'text-amber-700', icon: LuCalendar }
    };
    return styles[status];
  };

  return <div
    key={item.id}
    className="bg-white rounded-2xl shadow-xl p-4 transition-all duration-300 border border-neutral-100"
    style={{
      transform: isExpanded ? 'scale(1.02)' : 'none',
      boxShadow: '0 8px 32px rgba(23,23,23,0.08)'
    }}
  >
    {/* Encabezado */}
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={() => onClick()}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl ${device ? 'bg-[#171717]' : 'bg-amber-500/20'}`}>
          <LuSmartphone className={`w-6 h-6 ${device ? 'text-white' : 'text-amber-600'}`} />
        </div>
        <div>
          <h3 className="font-semibold text-[#171717]">
            {!device ? (
              <span className="text-amber-600 mt-1 inline-block">
                ¡Dispositivo no registrado!
              </span>
            ) : item.phoneModel}
          </h3>
          <p className="text-sm text-neutral-500">{item.customer}</p>
        </div>
      </div>
      <FaChevronDown className={`w-5 h-5 text-[#171717] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
    </div>

    {/* Contenido expandible */}
    {isExpanded && (
      <div className="mt-4 pt-4 border-t border-neutral-100 animate-slideDown">
        {/* Sección de registro de dispositivo */}
        {!device ? (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <h4 className="text-sm font-medium text-amber-700 mb-3 flex items-center gap-2">
              <LuSmartphone className="w-4 h-4" />
              Registro requerido
            </h4>

            <div className="bg-white p-4 rounded-lg shadow-inner">
              <div className="mx-auto max-w-[200px]">
                <QRCode
                  value={`{"android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME":"com.plfinance.eld/com.techinspire.eld.MyDeviceAdminReceiver","android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM":"w2Wpt50-AblFhEdZG2OAbiBoXrKLuBDAAc_Mn7mEdXg","android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION":"https://www.fdlpro.com/zte.apk","android.app.extra.PROVISIONING_LEAVE_ALL_SYSTEM_APPS_ENABLED":true,"android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {"id":"5965","affiliationId":"109302313843600888259","isKit":"0","url":"https://www.fdlpro.com/api/"}}`}
                  bgColor="transparent"
                  fgColor="#171717"
                  size={200}
                  className="w-full h-auto"
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-amber-600 mb-4">
                  Para habilitar las funciones de bloqueo y liberación,
                  debes registrar el dispositivo.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sección de información del dispositivo */}
            < div className="mb-4 p-3 bg-neutral-50 rounded-lg">
              <h4 className="text-sm font-medium text-[#171717] mb-2">Información del dispositivo</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-neutral-500">IMEI</p>
                  <p className="text-[#171717]">{device.imei}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Estado</p>
                  <p className={`font-medium ${device.isLocked ? 'text-red-600' : 'text-green-600'}`}>
                    {device.isLocked ? 'Bloqueado' : 'Operativo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones remotas */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                className="flex items-center justify-center space-x-2 p-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition"
                onClick={() => console.log('Toggle bloqueo')}
              >
                {device.isLocked
                  ? <LuLockOpen className="w-5 h-5 text-[#171717]" />
                  : <LuLock className="w-5 h-5 text-[#171717]" />}
                <span className="text-sm text-[#171717]">
                  {device.isLocked ? 'Desbloquear' : 'Bloquear'}
                </span>
              </button>

              <button
                className="flex items-center justify-center space-x-2 p-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition"
                onClick={() => console.log('Liberar dispositivo')}
                disabled={!device.isReleased}
              >
                <LuTrash className="w-5 h-5 text-[#171717]" />
                <span className="text-sm text-[#171717]">Liberar dispositivo</span>
              </button>
            </div>
          </>
        )}

        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-500">Total financiado</p>
            <p className="text-xl font-bold text-[#171717]">${item.amount}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">Progreso</p>
            {item.paymentPlan && <div className="flex items-center">
              <div className="w-20 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#171717] to-neutral-600 transition-all duration-500"
                  style={{ width: `${(item.paymentPlan.installments.filter(installment => installment.status === InstallmentStatuses.Paid).length / item.paymentPlan.installments.length) * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-neutral-600">
                {item.paymentPlan.installments.filter(installment => installment.status === InstallmentStatuses.Paid).length}/{item.paymentPlan.installments.length}
              </span>
            </div>}
          </div>
        </div>

        {/* Timeline de cuotas */}
        <div className="space-y-3">
          {item.paymentPlan?.installments.map((installment, i) => {
            const statusStyles = getStatusStyles(installment.status);
            const Icon = statusStyles.icon;

            return (
              <div key={i} className={`flex items-center justify-between p-3 ${statusStyles.bg} rounded-lg`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusStyles.bg}`}>
                    <Icon className={`w-4 h-4 ${statusStyles.text}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${statusStyles.text}`}>${installment.amount}</p>
                    <p className="text-xs text-neutral-500">{installment.dueDate}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles.text} ${statusStyles.bg}`}>
                  {InstallmentStatusesMap[installment.status]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )}
  </div>
}

PurchaseListItem.Skeleton = () => {
  return (
    <div role="status" className="bg-white rounded-2xl shadow-xl p-4 border border-neutral-100 animate-pulse">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-neutral-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
          </div>
        </div>
        <div className="w-5 h-5 bg-neutral-200 rounded-full" />
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};