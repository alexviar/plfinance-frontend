
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { MutationResultSelectorResult } from "@reduxjs/toolkit/query";
import { useCallback, useEffect } from "react";
import { UseFormSetError } from "react-hook-form";

export function useServerValidationErrors(state: MutationResultSelectorResult<MutationDefinition<any, any, any, any>>, setError: UseFormSetError<any>, keyMapper?: (key: string) => string){
  const memoizedKeyMapper = useCallback(keyMapper ?? ((key: string) => key), [])
  useEffect(()=>{
    if(state.isError && state.error.status === 422){
      const errors = state.error.data.errors
      const mappedErrors: {[key: string]: string[]} = {}
      for(let key in errors){
        const mappedKey = memoizedKeyMapper(key)
        if(mappedKey !== key) {
          if(mappedKey in mappedErrors){
            mappedErrors[mappedKey].push(...errors[key])
            continue
          }
        }
        mappedErrors[mappedKey] = [...errors[key]]
        setError(mappedKey, {
          type: "SERVER_VALIDATION",
          get message(){
            return mappedErrors[mappedKey].join("\n")
          }
        })
      }
    }
  }, [state, setError, memoizedKeyMapper])
}