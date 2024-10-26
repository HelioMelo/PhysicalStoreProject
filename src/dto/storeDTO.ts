import { DocumentTypeEnum } from "../enums/documentTypeEnum";

import { Store } from "../models/store";
import { AddressDTO } from "../dto/addressDTO";

class StoreDTO {
  public id: number;
  public name: string;
  public document: string;
  public address: AddressDTO;
  public documentType: DocumentTypeEnum;
  public distance?: string;

  constructor(
    id: number,
    name: string,
    document: string,
    address: AddressDTO,
    documentType: DocumentTypeEnum,
    distance?: string
  ) {
    if (!name || !document) {
      throw new Error("Nome e documento e obrigatórios.");
    }

    this.id = id;
    this.name = name;
    this.document = document;
    this.address = address;
    this.documentType = documentType;
    this.distance = distance;
  }

  static fromStore(store: Store, distance?: number): StoreDTO {
    return new StoreDTO(
      store.getId(),
      store.getName(),
      store.getDocument(),
      AddressDTO.fromAddress(store.getAddress()),
      store.getDocumentType(),
      distance ? distance.toFixed(2) : undefined
    );
  }
}

export { StoreDTO };
