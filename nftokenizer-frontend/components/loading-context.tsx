import {createContext, ReactNode, useContext, useState} from "react";

export type LoadingContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: (_: boolean) => {},
});

export function LoadingContextProvider({children}: {children: ReactNode}) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{loading, setLoading}}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoadingContext(): LoadingContextType {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingContextProvider')
  }

  return context;
}