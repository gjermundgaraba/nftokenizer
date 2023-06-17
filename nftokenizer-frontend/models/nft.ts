import { WalletAsset } from "./wallet-asset";

export class NftAsset extends WalletAsset {
  address: string;
  constructor(
    assetId: string,
    currency: string,
    numberOfAvailable: number,
    address: string
  ) {
    super(assetId, currency, numberOfAvailable);
    this.address = address;
  }
}
