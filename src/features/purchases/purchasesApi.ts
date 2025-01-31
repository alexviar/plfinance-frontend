import { appApi } from "../../commons/api/appApi";
import { Paginated } from "../../commons/api/types";
import { Device } from "../devices/devicesApi";

export enum InstallmentStatuses {
  Pending = 1,
  Current = 2,
  Paid = 3,
  PastDue = 4,
}

export const InstallmentStatusesMap: Record<InstallmentStatuses, string> = {
  [InstallmentStatuses.Pending]: "Pendiente",
  [InstallmentStatuses.Current]: "En Progreso",
  [InstallmentStatuses.Paid]: "Pagada",
  [InstallmentStatuses.PastDue]: "Vencida",
};

export type Installment = {
  id: number
  dueDate: string
  amount: number
  status: InstallmentStatuses
}

export type PaymentPlan = {
  id: number,
  installments: Installment[]
}

export type Purchase = {
  id: number
  purchaseDate: string
  customer: string
  phoneModel: string
  amount: number
  device: Device | null
  paymentPlan: PaymentPlan | null
  enrollData: string
}

export type PurchaseFilter = Partial<{

}>

const purchasesApi = appApi.enhanceEndpoints({
  addTagTypes: ['Purchases']
}).injectEndpoints({
  endpoints: (build) => ({
    getPurchases: build.query<Paginated<Purchase>, PurchaseFilter>({
      query: (params) => ({
        url: 'api/purchases',
        params
      }),
      providesTags: ['Purchases'],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          data.data.forEach((device) => {
            dispatch(purchasesApi.util.upsertQueryData('getPurchase', device.id, device))
          })
        }
        catch { }
      },
    }),

    getPurchase: build.query<Purchase, number>({
      query: (id) => ({
        url: `api/purchases/${id}`
      }),
      providesTags: (_, __, id) => [{ type: 'Purchases', id }]
    }),

    createPurchase: build.mutation<Purchase, Omit<Purchase, 'id' | 'device' | 'paymentPlan' | 'enrollData'> & { installments: number }>({
      query: (newPurchase) => ({
        url: 'api/purchases',
        method: 'POST',
        body: newPurchase
      }),
      invalidatesTags: ['Purchases']
    }),

    updatePurchase: build.mutation({
      query: ({ id, ...updates }) => ({
        url: `api/purchases/${id}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (_, __, { id }) => [
        'Purchases',
        { type: 'Purchases', id }
      ]
    }),

    deletePurchase: build.mutation({
      query: (id) => ({
        url: `api/purchases/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, { id }) => [
        'Purchases',
        { type: 'Purchases', id }
      ]
    })
  })
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseQuery,
  useLazyGetPurchaseQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation
} = purchasesApi;