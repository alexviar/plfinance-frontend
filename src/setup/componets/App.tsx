import { Provider } from "react-redux"
import { ErrorBoundary } from "../../ErrorBoundary"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppContainer } from "../../AppContainer"
import { useEffect, useReducer } from "react"
import { store } from "../store"
import PurchasesList from "../../features/purchases/components/PurchasesList"
import { DeviceEnrollmentScreen } from "../../features/devices/components/DeviceEnrollmentScreen"
import LockScreen from "../../features/lockscreen/components/LockScreen"
import '../nativeListener'
import { Dashboard } from "../../features/dashboard/components/Dashboard"


interface DeviceState {
  enrollmentData: {
    deviceId: number
  } | null;
  locked: boolean;
}

type Command =
  | { type: 'setState'; payload: DeviceState }
  | { type: 'lock' }
  | {
    type: 'finish_device_enrollment'; payload: {
      deviceId: number
      token?: string
    }
  };

function deviceReducer(state: DeviceState | null, action: Command): DeviceState | null {
  switch (action.type) {
    case 'setState':
      return action.payload;
    case 'lock':
      return { ...(state as DeviceState), locked: true };
    case 'finish_device_enrollment':
      return {
        ...(state as DeviceState),
        enrollmentData: {
          deviceId: action.payload.deviceId
        }
      };
    default:
      return state;
  }
}


export const App = () => {
  const [deviceState, dispatch] = useReducer(deviceReducer, null)
  console.log("DeviceState", deviceState)

  useEffect(() => {
    const remove = window.addNativeCommandHandler?.((command) => {
      dispatch(command as Command)
    })

    return remove;
  }, [])

  useEffect(() => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ event: 'getState' }))
  }, [])

  if (window.ReactNativeWebView && deviceState == null) {
    return
  }

  function renderRoutes() {
    if (window.ReactNativeWebView) {
      if (deviceState!.locked) {
        return <Route index element={<LockScreen />} />
      }

      if (!deviceState!.enrollmentData) {
        return <Route index element={<DeviceEnrollmentScreen />} />
      }
      return <Route index element={<Dashboard />} />
    }

    return <Route element={<AppContainer />}>
      <Route index element={<Navigate to="purchases" />} />
      <Route path="purchases" element={<PurchasesList />} />
    </Route>
  }

  return <Provider store={store}>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {renderRoutes()}
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>
}

export default App