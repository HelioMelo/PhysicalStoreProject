import { DocumentTypeEnum } from "../enums/documentTypeEnum";
import { Address } from "./address";

class Store {
  private id: number;
  private name: string;
  private address: Address;
  private document: string;
  private latitude: number;
  private longitude: number;
  private documentType: DocumentTypeEnum;

  constructor(
    id: number,
    name: string,
    document: string,
    address: Address,
    latitude: number,
    longitude: number,
    documentType: DocumentTypeEnum
  ) {
    this.id = id;
    this.name = name;
    this.document = document;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.documentType = documentType;
  }

  public getId(): number {
    return this.id;
  }

  public getDocument(): string {
    return this.document;
  }

  public getName(): string {
    return this.name;
  }

  public getAddress(): Address {
    return this.address;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public getDocumentType(): DocumentTypeEnum {
    return this.documentType;
  }

  public updateAddress(newAddress: Address): void {
    this.address = newAddress;
  }
}

export { Store };
