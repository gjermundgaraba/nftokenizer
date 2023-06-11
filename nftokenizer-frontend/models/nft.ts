import { WalletAsset } from "./wallet-asset";

export class NftAsset extends WalletAsset {
  address: string;
  constructor(
    assetId: number,
    currency: string,
    assetPrice: number,
    address: string
  ) {
    super(assetId, currency, assetPrice);
    this.address = address;
  }
}
