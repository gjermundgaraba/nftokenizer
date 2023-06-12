'use client';
import {createContext, useContext, useState} from "react";
import {Keplr} from "@keplr-wallet/types";
import {EmpowerChainTestnet, NeutronTestnet} from "./chains";
import {OfflineSigner} from "@cosmjs/proto-signing";

export type ChainContextType = {
  connected: boolean;
  address: string,
  signer: OfflineSigner | undefined;
  isKeplrInstalled: () => boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const ChainContext = createContext<ChainContextType>({
  connected: false,
  isKeplrInstalled: () => false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  address: '',
  signer: undefined,
});

export function ChainContextProvider({children}: {children: React.ReactNode}) {
  const keplr: Keplr = (window as any).keplr;
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState<OfflineSigner | undefined>(undefined);

  const connectWallet = async () => {
    await keplr.experimentalSuggestChain(NeutronTestnet)
    await keplr.experimentalSuggestChain(EmpowerChainTestnet);

    await keplr.enable([NeutronTestnet.chainId, EmpowerChainTestnet.chainId])
    const key = await keplr.getKey(NeutronTestnet.chainId)
    setAddress(key.bech32Address);
    setSigner(keplr.getOfflineSigner(NeutronTestnet.chainId));
    setConnected(true);
  }

  const disconnectWallet = async () => {
    setConnected(false);
  }

  const isKeplrInstalled = (): boolean => {
    return !!keplr;
  }

  return (
    <ChainContext.Provider value={{
      connected,
      isKeplrInstalled,
      connectWallet,
      disconnectWallet,
      address,
      signer,
    }}>
      {children}
    </ChainContext.Provider>
  )
}

export function useChainContext() {
  const context = useContext(ChainContext);

  if (!context) {
    throw new Error("useChainContext must be used inside a ChainContextProvider");
  }

  return context;
}