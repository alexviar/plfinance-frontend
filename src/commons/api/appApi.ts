import { createApi, retry } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { keysToCamel, keysToUnderscore } from "../utils/keyMapper";
import { createAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const logout = createAction('LOGOUT')

const staggeredBaseQuery = retry((async (args, api, extraOptions) => {
  if (typeof args === "string") {
    args = {
      url: args,
    }
  }
  if (args.body && !(args.body instanceof FormData)) args.body = keysToUnderscore(args.body)

  const result = await baseQuery(args, api, extraOptions)

  if (result.error && result.meta?.request.method !== 'GET') {
    retry.fail(result.error, result.meta)
  }

  const status = result.error?.status
  if (status === 401) {
    api.dispatch(logout())
    retry.fail(result.error, result.meta)
  }
  result.data = keysToCamel(result.data)
  result.error = keysToCamel(result.error)

  return result

}) as typeof baseQuery, {
  maxRetries: 1,
})

export const appApi = createApi({
  baseQuery: staggeredBaseQuery,
  endpoints: () => ({}),
  keepUnusedDataFor: 60 * 60 * 24,
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true
})

export function useResetApiState() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(appApi.util.resetApiState())
  }, [dispatch])
}