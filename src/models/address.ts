export class Address {
  private id: number;
  private zipCode: string;
  private street: string;
  private number: string;
  private complement: string;
  private neighborhood: string;
  private city: string;
  private state: string;

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

  public getId(): number {
    return this.id;
  }

  public getZipCode(): string {
    return this.zipCode;
  }

  public getStreet(): string {
    return this.street;
  }

  public getNumber(): string {
    return this.number;
  }

  public getComplement(): string {
    return this.complement;
  }

  public getNeighborhood(): string {
    return this.neighborhood;
  }

  public getCity(): string {
    return this.city;
  }

  public getState(): string {
    return this.state;
  }
}
