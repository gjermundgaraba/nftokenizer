'use client'
import { ReactNode, createContext, useEffect, useState } from "react";

export const ScreenResolutionContext = createContext({
  isMobileResolution: false
})

export function ScreenResolutionContextProvider({ children }: { children: ReactNode }) {
  const [isMobileResolution, setIsMobileResolution] = useState(typeof window !== "undefined" && window.innerWidth <= 740 ? true : false);

  function handleWindowResize() {
    if (window.innerWidth <= 740) {
      setIsMobileResolution(true)
    } else {
      setIsMobileResolution(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, [])

  return (
    <ScreenResolutionContext.Provider value={{ isMobileResolution }}>
      {children}
    </ScreenResolutionContext.Provider>
  )
}