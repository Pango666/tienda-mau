import { useState, useEffect, useCallback } from 'react'

interface ToastProps {
  message: string
  isVisible: boolean
  onHide: () => void
}

export default function Toast({ message, isVisible, onHide }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide()
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-surface-container-highest shadow-2xl p-4 flex items-center gap-3 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-8 h-8 bg-primary-container text-on-primary-container flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px]">check</span>
      </div>
      <div>
        <span className="font-label-mono text-[10px] text-primary block uppercase">
          // PRODUCTO AÑADIDO
        </span>
        <span className="font-headline-sm text-body-md font-bold text-on-surface uppercase">
          {message}
        </span>
      </div>
    </div>
  )
}

// Hook for managing toast state
export function useToast() {
  const [toast, setToast] = useState({ message: '', isVisible: false })

  const showToast = useCallback((message: string) => {
    setToast({ message, isVisible: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }, [])

  return { toast, showToast, hideToast }
}
