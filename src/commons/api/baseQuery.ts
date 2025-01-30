import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { apiUrl } from "../../configs/app"
import Qs from 'qs'
import { keysToUnderscore } from "../utils/keyMapper"

export const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: async (headers, _) => {
    const accessToken = localStorage.getItem('access_token')
    headers.set("Accept", "application/json")
    headers.set("Authorization", "Bearer " + accessToken)
    return headers
  },
  paramsSerializer: params => {
    return Qs.stringify(keysToUnderscore(params), {
      arrayFormat: "brackets",
      encode: false,
      filter: (_, value) => {
        if (typeof value === "boolean") {
          return value ? 1 : 0
        }
        if (value === "") return undefined
        return value
      }
    });
  }
})