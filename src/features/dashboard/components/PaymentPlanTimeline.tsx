import { LuCheck, LuCircleAlert, LuCircle } from "react-icons/lu";
import { InstallmentStatuses } from "../../purchases/purchasesApi";

type Props = {
  installments: Array<{
    dueDate: string;
    amount: number;
    status: InstallmentStatuses;
  }>;
};

export const PaymentPlanTimeline = ({ installments }: Props) => {
  return (
    <div className="space-y-4">
      {installments.map((installment, index) => {
        const statusConfig = {
          [InstallmentStatuses.Paid]: {
            icon: <LuCheck className="w-4 h-4 text-green-500" />,
            bg: "bg-green-100",
            text: "text-green-700"
          },
          [InstallmentStatuses.PastDue]: {
            icon: <LuCircleAlert className="w-4 h-4 text-red-500" />,
            bg: "bg-red-100",
            text: "text-red-700"
          },
          [InstallmentStatuses.Pending]: {
            icon: <LuCircle className="w-4 h-4 text-neutral-400" />,
            bg: "bg-neutral-100",
            text: "text-neutral-600"
          },
          [InstallmentStatuses.Current]: {
            icon: <LuCircle className="w-4 h-4 text-blue-500" />,
            bg: "bg-blue-100",
            text: "text-blue-700"
          }
        }[installment.status];

        return (
          <div key={index} className={`flex items-center gap-4 p-3 rounded-xl ${statusConfig.bg}`}>
            <div className="flex-shrink-0">
              {statusConfig.icon}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${statusConfig.text}`}>
                Cuota {index + 1} - {new Date(installment.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium text-[#171717]">
                MXN {Number(installment.amount).toFixed(2)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};