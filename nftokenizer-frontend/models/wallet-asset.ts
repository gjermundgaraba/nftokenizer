export class WalletAsset {
  assetId: number;
  name: string;
  numberOfAvailable: number;

  constructor(assetId: number, currency: string, assetPrice: number) {
    this.assetId = assetId;
    this.name = currency;
    this.numberOfAvailable = assetPrice;
  }
}
