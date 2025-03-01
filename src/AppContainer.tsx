import { ErrorBoundary } from "./ErrorBoundary"
import { Outlet } from "react-router-dom"

export const AppContainer = () => {

  return <ErrorBoundary>
    <Outlet />
  </ErrorBoundary>
}