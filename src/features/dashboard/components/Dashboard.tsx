import { LuCheck, LuCreditCard, LuCircleAlert, LuSmartphone } from "react-icons/lu";
import { useState } from "react";
import { InstallmentStatuses, Installment } from "../../purchases/purchasesApi";
import { useGetDeviceQuery } from "../../devices/devicesApi";
import { differenceInDays, parseISO } from "date-fns";
import { InstallmentStatusBadge } from "../../devices/components/PurchaseSummaryStep";

export const Dashboard = () => {
  const { data: device, isLoading } = useGetDeviceQuery(Number(localStorage.getItem('deviceId')));
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);

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

  const { purchase } = device;

  const nextPayment = purchase.paymentPlan.installments.find(
    i => i.status === InstallmentStatuses.Pending || i.status === InstallmentStatuses.Current
  );

  const daysRemaining = nextPayment ? differenceInDays(parseISO(nextPayment.dueDate), new Date()) : 0;

  const handleInstallmentClick = (installment: Installment) => {
    setSelectedInstallment(installment);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Encabezado resumen */}

      <div className="bg-[#171717] text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">¡Hola, {device.purchase.customer}!</h1>
            <p className="text-neutral-300">Tu dispositivo</p>
          </div>
          <LuSmartphone className="w-12 h-12 text-white/20" />
        </div>
        <div>
          <p className="font-semibold">{device.name}</p>
          <p className="text-sm text-neutral-300">{device.serialNumber}</p>
        </div>

        {/* <div className={`flex items-center gap-3 p-3 rounded-xl ${device.isLocked ? 'bg-red-500/20' : 'bg-green-500/20'
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
        </div> */}
      </div>

      {/* Alerta de próximo pago */}
      {nextPayment && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-2xl flex items-start gap-4 border border-amber-200">
          <div className="flex-shrink-0">
            <LuCircleAlert className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-[#171717] mb-1">
                  {nextPayment.status === InstallmentStatuses.PastDue
                    ? `Pago atrasado por ${Math.abs(daysRemaining)} días`
                    : daysRemaining > 0
                      ? `Próximo pago en ${daysRemaining} días`
                      : "Pago vence hoy"}
                </h3>
                <p className="text-sm text-amber-800">
                  Cuota {purchase.paymentPlan.installments.indexOf(nextPayment) + 1} - {(nextPayment.amount)}
                </p>
              </div>
              <button
                onClick={() => setSelectedInstallment(nextPayment)}
                className="bg-gradient-to-r from-[#171717] to-neutral-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-md transition-all"
              >
                <LuCreditCard className="w-5 h-5" />
                <span>Pagar ahora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listado interactivo de cuotas */}
      <div className="space-y-3">
        {purchase.paymentPlan.installments.map((installment, index) => (
          <div
            key={index}
            onClick={() => handleInstallmentClick(installment)}
            className="group bg-white p-4 rounded-xl shadow-sm border-l-4 cursor-pointer transition-all hover:shadow-md"
            style={{
              borderLeftColor: installment.status === InstallmentStatuses.Paid
                ? '#22c55e'
                : installment.status === InstallmentStatuses.PastDue
                  ? '#ef4444'
                  : '#eab308'
            }}
          >

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#171717]">
                    Cuota {index + 1}
                  </span>
                  <InstallmentStatusBadge status={installment.status} />
                </div>
                <p className="text-sm text-neutral-500">
                  Vence: {new Date(installment.dueDate).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-[#171717]">
                  {(installment.amount)}
                </p>
                {installment.status !== InstallmentStatuses.Paid && (
                  <div className="flex items-center gap-1 text-sm text-amber-600 mt-1">
                    <LuCreditCard className="w-4 h-4" />
                    <span>Pagar ahora</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de pago/detalles */}
      <PaymentModal
        installment={selectedInstallment}
        onClose={() => setSelectedInstallment(null)}
      />
    </div>
  );
};

type PaymentModalProps = {
  installment: Installment | null;
  onClose: () => void;
}

export const PaymentModal = ({ installment, onClose }: PaymentModalProps) => {
  // const [paymentData, setPaymentData] = useState({
  //   cardNumber: '',
  //   expiry: '',
  //   cvc: ''
  // });

  if (!installment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {installment.status === InstallmentStatuses.Paid
              ? 'Detalle de pago'
              : 'Realizar pago'}
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-[#171717]">
            &times;
          </button>
        </div>

        {installment.status === InstallmentStatuses.Paid ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3">
              <LuCheck className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium">Pago completado</p>
                <p className="text-sm text-neutral-600">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <dl className="grid gap-3">
              <InfoRow label="Método de pago" value="Tarjeta Visa **** 1234" />
              <InfoRow label="Referencia" value="" />
              <InfoRow label="Monto" value={String(installment.amount)} />
            </dl>
          </div>
        ) : (
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#171717]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expiración</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#171717]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#171717]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#171717] text-white py-3 rounded-lg font-medium hover:bg-opacity-90"
            >
              Pagar {(installment.amount)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-neutral-100">
    <span className="text-neutral-500">{label}</span>
    <span className="text-[#171717] font-medium">{value}</span>
  </div>
);