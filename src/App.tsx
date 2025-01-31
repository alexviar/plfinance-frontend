import { Provider } from "react-redux"
import LockScreen from "./features/lockscreen/components/LockScreen"
import PurchasesList from "./features/purchases/components/PurchasesList"
import { store } from "./store"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { UnderConstruction } from "./UnderConstruction"
import { ErrorBoundary } from "./ErrorBoundary"

const router = createBrowserRouter([
  {
    path: '',
    element: <UnderConstruction />
  },
  {
    path: 'lockscreen',
    element: <LockScreen />
  },
  {
    path: 'purchases',
    element: <PurchasesList />
  },
  {
    path: 'enroll',
    element: <UnderConstruction />
  },
])

export const App = () => {
  return <Provider store={store}>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </Provider>
}

export default App