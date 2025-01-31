import { appApi } from "../../commons/api/appApi";

export type Device = {
  id: number
  imei: string
  isLocked: boolean
  isReleased: boolean
}

export const devicesApi = appApi.enhanceEndpoints({
  addTagTypes: ['Devices']
}).injectEndpoints({
  endpoints: (build) => ({
    enrollDevice: build.mutation<Device, { pushToken: string, purchaseId: number }>({
      query: (newPurchase) => ({
        method: 'POST',
        url: 'api/devices',
        body: newPurchase
      }),
    })
  })
})

export const {
  useEnrollDeviceMutation
} = devicesApi