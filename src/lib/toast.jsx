import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const ToastCtx = createContext(() => {})

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null)
  const timer = useRef(null)
  const toast = useCallback((m) => {
    setMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(null), 2200)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={'toast' + (msg ? ' is-on' : '')} role="status" aria-live="polite">{msg}</div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)
