import { LuCircleAlert, LuClock, LuLock, LuSmartphone, LuWallet, LuCalendarCheck, LuCheck } from "react-icons/lu";
import { PaymentPlanTimeline } from "./PaymentPlanTimeline";
import { useGetDeviceQuery } from "../../devices/devicesApi";
import { InstallmentStatuses } from "../../purchases/purchasesApi";

export const Dashboard = () => {
  const { data: device, isLoading } = useGetDeviceQuery(Number(localStorage.getItem('deviceId')));

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-24 bg-neutral-200 rounded-2xl animate-pulse" />
        <div className="h-48 bg-neutral-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-neutral-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!device) return null;

  const nextPayment = device.purchase.paymentPlan.installments.find(
    i => i.status === InstallmentStatuses.Pending || i.status === InstallmentStatuses.Current
  );

  const paidInstallments = device.purchase.paymentPlan.installments.filter(
    i => i.status === InstallmentStatuses.Paid
  ).length;

  return (
    <div className="p-4 space-y-6">
      {/* Encabezado - Estado del dispositivo */}
      <div className="bg-[#171717] text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">¡Hola, {device.purchase.customer}!</h1>
            <p className="text-neutral-300">Estado de tu dispositivo</p>
          </div>
          <LuSmartphone className="w-12 h-12 text-white/20" />
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-xl ${device.isLocked ? 'bg-red-500/20' : 'bg-green-500/20'
          }`}>
          {device.isLocked ? (
            <LuLock className="w-6 h-6 text-red-400" />
          ) : (
            <LuCheck className="w-6 h-6 text-green-400" />
          )}
          <span className="font-medium">
            {device.isLocked
              ? "Dispositivo bloqueado"
              : "Dispositivo operativo"}
          </span>
        </div>
      </div>

      {/* Alerta de pago pendiente */}
      {nextPayment && (
        <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-4">
          <LuCircleAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-[#171717] mb-1">Próximo pago</h3>
            <p className="text-neutral-600">
              {nextPayment.status === InstallmentStatuses.PastDue
                ? `Tienes un pago atrasado de ${(nextPayment.amount)}`
                : `Próximo pago: ${(nextPayment.amount)} - ${new Date(nextPayment.dueDate).toLocaleDateString()}`
              }
            </p>
          </div>
        </div>
      )}

      {/* Progreso de pagos */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <LuWallet className="w-5 h-5 text-[#171717]" />
            Progreso del plan
          </h2>
          <span className="text-neutral-500 text-sm">
            {paidInstallments}/{device.purchase.paymentPlan.installments.length} pagos
          </span>
        </div>
        {/* <Progress
          value={(paidInstallments / purchase.paymentPlan.installments.length) * 100}
          variant={purchase.device.isLocked ? 'error' : 'default'}
        /> */}
        <div className="flex items-center">
          <div className="w-20 h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#171717] to-neutral-600 transition-all duration-500"
              style={{ width: `${(paidInstallments / device.purchase.paymentPlan.installments.length) * 100}%` }}
            />
          </div>
          <span className="ml-2 text-sm text-neutral-600">
            {paidInstallments}/{device.purchase.paymentPlan.installments.length}
          </span>
        </div>
      </div>

      {/* Cronograma de pagos */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <LuCalendarCheck className="w-5 h-5 text-[#171717]" />
            Cronograma de pagos
          </h2>
          <span className="text-neutral-500 text-sm">
            {device.purchase.paymentPlan.installments.length} meses
          </span>
        </div>
        <PaymentPlanTimeline installments={device.purchase.paymentPlan.installments} />
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center gap-2 hover:bg-neutral-50">
          <LuClock className="w-8 h-8 text-[#171717]" />
          <span className="text-sm font-medium">Historial de pagos</span>
        </button>
        <button className="p-4 bg-white rounded-2xl shadow-sm flex flex-col items-center gap-2 hover:bg-neutral-50">
          <LuLock className="w-8 h-8 text-[#171717]" />
          <span className="text-sm font-medium">Seguridad del dispositivo</span>
        </button>
      </div>
    </div>
  );
};