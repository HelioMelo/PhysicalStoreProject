class Store {
  private name: string;
  private address: string;
  private zipCode: string;
  private latitude: number;
  private longitude: number;

  constructor(
    name: string,
    address: string,
    zipCode: string,
    latitude: number,
    longitude: number
  ) {
    this.name = name;
    this.address = address;
    this.zipCode = zipCode;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public getName(): string {
    return this.name;
  }

  public getAddress(): string {
    return this.address;
  }

  public getZipCode(): string {
    return this.zipCode;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public updateAddress(newAddress: string): void {
    this.address = newAddress;
  }
}

export { Store };
