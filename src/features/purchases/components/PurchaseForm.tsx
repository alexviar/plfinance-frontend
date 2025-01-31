import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LuX, LuQrCode, LuLoader } from 'react-icons/lu';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { useCreatePurchaseMutation } from '../purchasesApi';
import { useServerValidationErrors } from '../../../commons/hooks/useServerValidationErrors';
import { getErrorMessage } from '../../../commons/api/getErrorMessage';

type Props = {
  onClose(): void
}

type Step = 'form' | 'qr';

const schema = yup.object().shape({
  customer: yup.string().required('El nombre del cliente es requerido'),
  phoneModel: yup.string().required('El modelo del teléfono es requerido'),
  total: yup
    .number()
    .typeError('El monto debe ser un número válido')
    .positive('El monto debe ser mayor a cero')
    .required('El monto total es requerido'),
  installments: yup
    .number()
    .typeError('Selecciona un número válido de cuotas')
    .required()
    .oneOf([3, 6, 9, 12], 'Selecciona un número de cuotas válido'),
  startDate: yup
    .date()
    .typeError('Fecha inválida')
    .required('La fecha de inicio es requerida')
  // .min(new Date(), 'La fecha no puede ser anterior al día actual')
});

type FormValues = typeof schema extends yup.ObjectSchema<infer T> ? T : never

export const PurchaseForm = ({ onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState<Step>('form');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      installments: 6,
      startDate: new Date().toISOString().split('T')[0] as any
    }
  });

  const [createPurchase, createPurchaseResult] = useCreatePurchaseMutation()
  useServerValidationErrors(createPurchaseResult, setError, (key) => {
    if (key == 'amount') return 'total'
    if (key == 'purchaseDate') return 'startDate'
    return key
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await createPurchase({
        amount: values.total,
        purchaseDate: values.startDate.toISOString().split('T')[0],
        customer: values.customer,
        phoneModel: values.phoneModel,
        installments: values.installments
      }).unwrap()
      setCurrentStep('qr');
    } catch { }
  };

  function renderError() {
    return createPurchaseResult.isError && (
      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
        {getErrorMessage(createPurchaseResult.error)}
      </div>
    )
  }

  const qrValue = createPurchaseResult.isSuccess
    ? createPurchaseResult.data.enrollData
    : '';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-[#171717]"
        >
          <LuX className="w-6 h-6" />
        </button>

        {currentStep === 'form' ? (
          <>
            <h2 className="text-2xl font-bold text-[#171717] mb-6">Nueva Venta</h2>

            {renderError()}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#171717] mb-1">
                  Cliente *
                </label>
                <input
                  {...register('customer')}
                  className={`w-full p-3 border ${errors.customer ? 'border-red-200' : 'border-neutral-200'
                    } rounded-lg focus:ring-2 focus:ring-[#171717] focus:border-transparent`}
                  placeholder="Nombre del cliente"
                />
                {errors.customer && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#171717] mb-1">
                  Modelo del Teléfono *
                </label>
                <input
                  {...register('phoneModel')}
                  className={`w-full p-3 border ${errors.phoneModel ? 'border-red-200' : 'border-neutral-200'
                    } rounded-lg focus:ring-2 focus:ring-[#171717] focus:border-transparent`}
                  placeholder="Ej: Xiaomi Redmi Note 13 Pro"
                />
                {errors.phoneModel && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneModel.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-1">
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className={`w-full p-3 border ${errors.startDate ? 'border-red-200' : 'border-neutral-200'
                      } rounded-lg focus:ring-2 focus:ring-[#171717] focus:border-transparent`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-1">
                    Cuotas
                  </label>
                  <select
                    {...register('installments')}
                    className={`w-full p-3 border ${errors.installments ? 'border-red-200' : 'border-neutral-200'
                      } rounded-lg focus:ring-2 focus:ring-[#171717] focus:border-transparent`}
                  >
                    {[3, 6, 9, 12].map(num => (
                      <option key={num} value={num}>
                        {num} meses
                      </option>
                    ))}
                  </select>
                  {errors.installments && (
                    <p className="text-red-500 text-sm mt-1">{errors.installments.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#171717] mb-1">
                  Total *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    $
                  </span>
                  <input
                    {...register('total')}
                    className={`w-full pl-8 pr-3 py-3 border ${errors.total ? 'border-red-200' : 'border-neutral-200'
                      } rounded-lg focus:ring-2 focus:ring-[#171717] focus:border-transparent`}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {errors.total && (
                  <p className="text-red-500 text-sm mt-1">{errors.total.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={createPurchaseResult.isLoading}
                className="w-full bg-[#171717] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPurchaseResult.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LuLoader className="animate-spin w-5 h-5" />
                    Cargando...
                  </div>
                ) : (
                  'Continuar al Registro'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <LuQrCode className="w-12 h-12 mx-auto text-[#171717] mb-4" />
            <h2 className="text-xl font-bold text-[#171717] mb-2">Registro de Dispositivo</h2>
            <p className="text-neutral-600 mb-6">
              Para habilitar las funciones de bloqueo y liberación,
              debes registrar el dispositivo.
            </p>

            <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
              <QRCode
                value={qrValue}
                bgColor="#FFFFFF"
                fgColor="#171717"
                size={200}
                className="mx-auto"
              />
            </div>

            <div className="mt-6 text-sm text-neutral-500">
              <p>ID de compra: {createPurchaseResult.data?.id}</p>
              <p>Dispositivo: {watch('phoneModel')}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-[#171717] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};