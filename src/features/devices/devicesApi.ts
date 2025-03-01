import { appApi } from "../../commons/api/appApi";
import { Purchase } from "../purchases/purchasesApi";

export type Product = {
  id: number
  name: string
  attributes: {
    model: string
    brand: string
    color: string
  }
  price: number
}

export type Device = {
  id: number

  name: string
  model: string
  brand: string

  serialNumber: string

  purchaseId: number
  pushToken?: string
  isLocked: boolean
  isReleased: boolean

  enrollmentData: string

  purchase: Purchase
}

export const devicesApi = appApi.enhanceEndpoints({
  addTagTypes: ['Devices']
}).injectEndpoints({
  endpoints: (build) => ({
    getDevice: build.query<Device, number>({
      query: (id) => ({
        url: `api/devices/${id}`
      }),
    }),
    updatePushToken: build.mutation<Device, Pick<Device, 'id' | 'pushToken'>>({
      query: ({ id, ...body }) => ({
        method: 'PUT',
        url: `api/devices/${id}/push-token`,
        body
      }),
    })
  })
})

export const {
  useUpdatePushTokenMutation,
  useGetDeviceQuery,
} = devicesApi