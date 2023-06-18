export class WalletAsset {
  assetId: string;
  name: string;
  numberOfAvailable: number;

  constructor(assetId: string, name: string, numberOfAvailable: number) {
    this.assetId = assetId;
    this.name = name;
    this.numberOfAvailable = numberOfAvailable;
  }
}
