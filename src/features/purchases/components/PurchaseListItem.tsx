import { LuCalendar, LuCheck, LuClock, LuLock, LuLockOpen, LuSmartphone, LuQrCode, LuUnlink } from "react-icons/lu";
import { InstallmentStatuses, InstallmentStatusesMap, Purchase } from "../purchasesApi";
import { FaChevronDown, FaExclamationTriangle } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useState } from "react";

type Props = {
  item: Purchase
  isExpanded: boolean
  onClick(): void
}

export const PurchaseListItem = ({ item, isExpanded, onClick }: Props) => {
  const { device } = item;
  const [showQR, setShowQR] = useState(false);

  const getStatusStyles = (status: InstallmentStatuses) => ({
    [InstallmentStatuses.Paid]: { bg: 'bg-green-100', text: 'text-green-700', icon: LuCheck },
    [InstallmentStatuses.Current]: { bg: 'bg-blue-100', text: 'text-blue-700', icon: LuClock },
    [InstallmentStatuses.PastDue]: { bg: 'bg-red-100', text: 'text-red-700', icon: FaExclamationTriangle },
    [InstallmentStatuses.Pending]: { bg: 'bg-amber-100', text: 'text-amber-700', icon: LuCalendar }
  }[status]);

  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-4 transition-all duration-300 border border-neutral-100 hover:border-neutral-200"
      style={{
        transform: isExpanded ? 'scale(1.02)' : 'none',
        boxShadow: '0 8px 32px rgba(23,23,23,0.08)'
      }}
    >
      {/* Encabezado */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#171717]">
            <LuSmartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#171717]">
              {device.name}
            </h3>
            <p className="text-sm text-neutral-500">{item.customer}</p>
          </div>
        </div>
        <FaChevronDown className={`w-5 h-5 text-[#171717] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-100 animate-slideDown">
          {/* Sección de información del dispositivo */}
          <div className="mb-4 p-4 bg-neutral-50 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-[#171717]">Información del dispositivo</h4>
              <button
                onClick={() => setShowQR(!showQR)}
                className="p-2 rounded-lg bg-neutral-200 rounded-lg hover:bg-neutral-200 transition"
                title="Mostrar QR"
              >
                <LuQrCode className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InfoItem label="Marca" value={device.brand} />
              <InfoItem label="Modelo" value={device.model} />
              {/* <InfoItem label="Color" value={device.color} /> */}
              <div className="col-span-2">
                <InfoItem label="Número de serie" value={device.serialNumber} />
              </div>
            </div>

            {/* Acciones remotas */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className="flex items-center justify-center space-x-2 p-2 bg-neutral-200 rounded-lg hover:bg-neutral-200 transition"
                onClick={() => console.log('Toggle bloqueo')}
              >
                {device.isLocked
                  ? <LuLockOpen className="w-5 h-5 text-[#171717]" />
                  : <LuLock className="w-5 h-5 text-[#171717]" />}
                <span className="text-[#171717]">
                  {device.isLocked ? 'Desbloquear' : 'Bloquear'}
                </span>
              </button>

              <button
                className="flex items-center justify-center space-x-2 p-2 bg-neutral-200 rounded-lg hover:bg-neutral-200 transition"
                onClick={() => console.log('Liberar')}
                disabled={!device.isReleased}
              >
                <LuUnlink className="w-5 h-5 text-[#171717]" />
                <span className="text-[#171717]">Liberar</span>
              </button>
            </div>

            {showQR && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-neutral-100">
                <div className="mx-auto max-w-[200px]">
                  <QRCode
                    value={device.enrollmentData}
                    bgColor="transparent"
                    fgColor="#171717"
                    size={200}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-center text-sm text-neutral-600 mt-3">
                  Escanee este código para habilitar las funciones de bloqueo del dispositivo
                </p>
              </div>
            )}
          </div>

          {/* Estadísticas de pago */}
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
                      <p className={`text-sm font-medium ${statusStyles.text}`}>MXN {Number(installment.amount).toFixed(2)}</p>
                      <p className="text-xs text-neutral-500">{new Date(installment.dueDate).toLocaleDateString()}</p>
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
    </div >
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 bg-white rounded-lg shadow-sm">
    <p className="text-neutral-500">{label}</p>
    <p className="text-[#171717] font-medium">{value}</p>
  </div>
);

PurchaseListItem.Skeleton = () => {
  return (
    <div role="status" className="bg-white rounded-2xl shadow-xl p-4 border border-neutral-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-neutral-200 rounded-xl" />
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