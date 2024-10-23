import { Store } from "../models/store";

class StoreDTO {
  public name: string;
  public address: string;
  public zipCode: string;
  public number: string;
  public distance?: string;

  constructor(
    name: string,
    address: string,
    zipCode: string,
    number: string,
    distance?: string
  ) {
    this.name = name;
    this.address = address;
    this.zipCode = zipCode;
    this.number = number;
    this.distance = distance;
  }

  static fromStore(store: Store, distance?: number): StoreDTO {
    return new StoreDTO(
      store.getName(),
      store.getAddress(),
      store.getZipCode(),
      store.getNumber(),
      distance ? distance.toFixed(2) : undefined
    );
  }
}

export { StoreDTO };
