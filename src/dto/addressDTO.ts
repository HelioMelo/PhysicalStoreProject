import { Address } from "./../models/address";

class AddressDTO {
  public id: number;
  public zipCode: string;
  public street: string;
  public number: string;
  public complement: string;
  public neighborhood: string;
  public city: string;
  public state: string;

  constructor(
    id: number,
    zipCode: string,
    street: string,
    number: string = "S/N",
    complement: string = "",
    neighborhood: string,
    city: string,
    state: string
  ) {
    this.id = id;
    this.zipCode = zipCode;
    this.street = street;
    this.number = number;
    this.complement = complement;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
  }

  static fromAddress(address: Address): AddressDTO {
    return new AddressDTO(
      address.getId(),
      address.getZipCode(),
      address.getStreet(),
      address.getNumber(),
      address.getComplement(),
      address.getNeighborhood(),
      address.getCity(),
      address.getState()
    );
  }
}

export { AddressDTO };
