'use client';
import {createContext, ReactNode, useContext, useState} from "react";
import {Keplr} from "@keplr-wallet/types";
import {EmpowerChainTestnet, NeutronTestnet} from "./chains";
import {OfflineSigner} from "@cosmjs/proto-signing";

export type WalletInfo = {
  neutronAddress: string,
  empowerAddress: string,
}

export type ChainContextType = {
  connected: boolean;
  neutronAddress: string,
  empowerAddress: string,
  neutronSigner: OfflineSigner | undefined;
  empowerSigner: OfflineSigner | undefined;
  isKeplrInstalled: () => boolean;
  connectWallet: () => Promise<WalletInfo>;
  disconnectWallet: () => Promise<void>;
}

const ChainContext = createContext<ChainContextType>({
  connected: false,
  isKeplrInstalled: () => false,
  connectWallet: async () => {return {neutronAddress: '', empowerAddress: ''}},
  disconnectWallet: async () => {},
  neutronAddress: '',
  empowerAddress: '',
  neutronSigner: undefined,
  empowerSigner: undefined,
});

export function ChainContextProvider({children}: {children: ReactNode}) {
  const keplr: Keplr = (window as any).keplr;
  const [connected, setConnected] = useState(false);
  const [neutronAddress, setNeutronAddress] = useState('');
  const [empowerAddress, setEmpowerAddress] = useState('');
  const [neutronSigner, setNeutronSigner] = useState<OfflineSigner | undefined>(undefined);
  const [empowerSigner, setEmpowerSigner] = useState<OfflineSigner | undefined>(undefined);

  const connectWallet = async () => {
    await keplr.experimentalSuggestChain(NeutronTestnet)
    await keplr.experimentalSuggestChain(EmpowerChainTestnet);
    await keplr.enable([NeutronTestnet.chainId, EmpowerChainTestnet.chainId])

    const neutronKey = await keplr.getKey(NeutronTestnet.chainId)
    setNeutronAddress(neutronKey.bech32Address);
    setNeutronSigner(keplr.getOfflineSigner(NeutronTestnet.chainId));

    const empowerKey = await keplr.getKey(EmpowerChainTestnet.chainId)
    setEmpowerAddress(empowerKey.bech32Address);
    setEmpowerSigner(keplr.getOfflineSigner(EmpowerChainTestnet.chainId));

    setConnected(true);

    return {
      neutronAddress: neutronKey.bech32Address,
      empowerAddress: empowerKey.bech32Address
    };
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
      neutronAddress,
      empowerAddress,
      neutronSigner,
      empowerSigner,
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