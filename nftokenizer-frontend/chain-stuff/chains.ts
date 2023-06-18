'use client';
import {ChainInfo} from "@keplr-wallet/types";

export const NeutronTestnet: ChainInfo = {
  chainId: "pion-1",
  chainName: "Neutron Testnet",
  rpc: "https://rpc-palvus.pion-1.ntrn.tech:443",
  rest: "https://rest-palvus.pion-1.ntrn.tech",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "neutron",
    bech32PrefixAccPub: "neutron" + "pub",
    bech32PrefixValAddr: "neutron" + "valoper",
    bech32PrefixValPub: "neutron" + "valoperpub",
    bech32PrefixConsAddr: "neutron" + "valcons",
    bech32PrefixConsPub: "neutron" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "NTRN",
      coinMinimalDenom: "untrn",
      coinDecimals: 6,
      coinGeckoId: "ntrn",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "NTRN",
      coinMinimalDenom: "untrn",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "NTRN",
    coinMinimalDenom: "untrn",
    coinDecimals: 6,
  },
}

export const EmpowerChainTestnet: ChainInfo = {
  chainId: "circulus-1",
  chainName: "EmpowerChain Testnet",
  rpc: "https://empower-testnet-rpc.polkachu.com",
  rest: "https://empower-testnet-api.polkachu.com",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "empower",
    bech32PrefixAccPub: "empower" + "pub",
    bech32PrefixValAddr: "empower" + "valoper",
    bech32PrefixValPub: "empower" + "valoperpub",
    bech32PrefixConsAddr: "empower" + "valcons",
    bech32PrefixConsPub: "empower" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "MPWR",
      coinMinimalDenom: "umpwr",
      coinDecimals: 6,
      coinGeckoId: "mpwr",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "MPWR",
      coinMinimalDenom: "umpwr",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "MPWR",
    coinMinimalDenom: "umpwr",
    coinDecimals: 6,
  },
}