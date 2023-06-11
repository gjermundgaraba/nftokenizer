export class WalletAsset {
  assetId: number;
  currency: string;
  assetPrice: number;

  constructor(assetId: number, currency: string, assetPrice: number) {
    this.assetId = assetId;
    this.currency = currency;
    this.assetPrice = assetPrice;
  }
}
