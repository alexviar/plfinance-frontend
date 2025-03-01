import { useState, useEffect } from "react"
import { LuLock, LuPhone, LuCreditCard, LuKey } from "react-icons/lu"

export default function LockScreen() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isUnlocking, _] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const handleUnlock = () => {
    (window as any).ReactNativeWebView.postMessage(JSON.stringify({ event: 'unlock' }))
    localStorage.setItem('locked', '')
    // setIsUnlocking(true)
    // setTimeout(() => setIsUnlocking(false), 2000) // Reset after 2 seconds
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-primary to-primary/90 flex flex-col items-center justify-between px-6 py-12 text-white overflow-hidden">
      {/* Hora y fecha */}
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </h1>
        <p className="text-xl mt-2 font-light">
          {currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Mensaje de impago */}
      <div className="text-center">
        <LuLock size={48} className="mx-auto mb-6 text-white/80" />
        <h2 className="text-3xl font-bold mb-3">Dispositivo bloqueado</h2>
        <p className="text-lg mb-8 text-white/80">Por favor, regularice su pago para desbloquear</p>
        <div className="space-y-4 mb-4">
          <button
            type="button"
            className="w-64 bg-white text-primary px-6 py-3 rounded-full font-bold flex items-center justify-center mx-auto hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            <LuCreditCard size={24} className="mr-2" />
            Ir a pagar
          </button>
          <button
            type="button"
            className="w-64 bg-white/20 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center mx-auto hover:bg-white/30 transition-colors focus:outline-none focus:ring-4 focus:ring-white/50"
            onClick={handleUnlock}
          >
            <LuKey size={24} className="mr-2" />
            {isUnlocking ? "Desbloqueando..." : "Desbloquear"}
          </button>
        </div>
      </div>

      {/* Llamada de emergencia */}
      <div className="mb-8">
        <button
          type="button"
          className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold flex items-center hover:bg-white/10 transition-colors focus:outline-none focus:ring-4 focus:ring-white/50"
        >
          <LuPhone size={24} className="mr-2" />
          Llamada de emergencia
        </button>
      </div>
    </div>
  )
}

