import { Provider } from "react-redux"
// import LockScreen from "./features/lockscreen/components/LockScreen"
import PurchasesList from "./features/purchases/components/PurchasesList"
import { store } from "./store"

export const App = () => {
  return <Provider store={store}>
    <PurchasesList />
  </Provider>
}

export default App