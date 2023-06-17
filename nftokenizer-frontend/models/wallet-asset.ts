export class WalletAsset {
  assetId: string;
  name: string;
  numberOfAvailable: number;

  constructor(assetId: string, currency: string, numberOfAvailable: number) {
    this.assetId = assetId;
    this.name = currency;
    this.numberOfAvailable = numberOfAvailable;
  }
}
