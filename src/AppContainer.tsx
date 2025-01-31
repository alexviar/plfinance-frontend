import { useEffect } from "react"
import { ErrorBoundary } from "./ErrorBoundary"
import { Outlet, useNavigate } from "react-router-dom"

export const AppContainer = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const enrolled = localStorage.getItem('enrolled') ?? false
    if (!enrolled) {
      navigate('/enrollment', { replace: true })
      return
    }
    const locked = localStorage.getItem('locked') ?? false
    if (locked) {
      navigate('/lockscreen', { replace: true })
    }
  }, [])

  return <ErrorBoundary>
    <Outlet />
  </ErrorBoundary>
}