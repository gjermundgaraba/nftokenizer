'use client'
import { ReactNode, createContext, useEffect, useState } from "react";

export const ScreenResolutionContext = createContext({
  isResolutionMobile: false,
  isResolutionMedium: false
})

export function ScreenResolutionContextProvider({ children }: { children: ReactNode }) {
  const [isResolutionMobile, setIsResolutionMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 740 ? true : false);
  const [isResolutionMedium, setisResolutionMedium] = useState(typeof window !== "undefined" && window.innerWidth <= 1234 ? true : false);


  function handleWindowResize() {
    if (window.innerWidth <= 740) {
      setIsResolutionMobile(true)
    } else {
      setIsResolutionMobile(false)
    }
    if (window.innerWidth <= 1234) {
      setisResolutionMedium(true)
    } else {
      setisResolutionMedium(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, [])

  return (
    <ScreenResolutionContext.Provider value={{ isResolutionMobile, isResolutionMedium }}>
      {children}
    </ScreenResolutionContext.Provider>
  )
}