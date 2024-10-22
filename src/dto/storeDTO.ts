import { Store } from "../models/store";

class StoreDTO {
  public name: string;
  public address: string;
  public zipCode: string;
  public distance: string;

  constructor(
    name: string,
    address: string,
    zipCode: string,
    distance: string
  ) {
    this.name = name;
    this.address = address;
    this.zipCode = zipCode;
    this.distance = distance;
  }

  static fromStore(store: Store, distance: number): StoreDTO {
    return new StoreDTO(
      store.getName(),
      store.getAddress(),
      store.getZipCode(),
      distance.toFixed(2)
    );
  }
}

export { StoreDTO };
