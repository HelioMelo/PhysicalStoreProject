import { zipCodeApi } from "../api/zipCodeApi";
import { geocodeAddressApi } from "../api/geocodeAddressApi";
import { saveStore } from "../repository/storeRepository";
import { StoreDTO } from "../dto/storeDTO";

import { DocumentTypeEnum } from "../enums/documentTypeEnum";
import { StoreService } from "../services/storeService";
import { AddressDTO } from "../dto/addressDTO";

jest.mock("../api/zipCodeApi");
jest.mock("../api/geocodeAddressApi");
jest.mock("../repository/storeRepository");

describe("StoreService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve salvar uma loja com dados válidos", async () => {
    const addressData = {
      cep: "12345678",
      logradouro: "Rua Exemplo",
      bairro: "Bairro",
      localidade: "Cidade",
      uf: "UF",
    };

    (zipCodeApi as jest.Mock).mockResolvedValue(addressData);
    (geocodeAddressApi as jest.Mock).mockResolvedValue({
      latitude: -23.55052,
      longitude: -46.633308,
    });
    (saveStore as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Loja Exemplo",
      document: "123.456.789-09",
      addressId: 1,
      latitude: -23.55052,
      longitude: -46.633308,
      documentType: DocumentTypeEnum.CPF,
    });

    const address = new AddressDTO(
      0,
      "12345678",
      "Rua Exemplo",
      "10",
      "",
      "Bairro",
      "Cidade",
      "UF"
    );
    const storeDTO = new StoreDTO(
      1,
      "Loja Exemplo",
      "123.456.789-09",
      address,
      DocumentTypeEnum.CPF
    );

    const savedStore = await StoreService.saveStore(storeDTO);

    expect(savedStore).toHaveProperty("id", 1);
    expect(savedStore).toHaveProperty("name", "Loja Exemplo");
    expect(savedStore).toHaveProperty("document", "123.456.789-09");
    expect(savedStore).toHaveProperty("documentType", "CPF");
  });

  it("deve lançar um erro para CPF inválido", async () => {
    const address = new AddressDTO(
      0,
      "12345678",
      "Rua Exemplo",
      "10",
      "",
      "Bairro",
      "Cidade",
      "UF"
    );
    const storeDTO = new StoreDTO(
      1,
      "Loja Inválida",
      "1234567890",
      address,
      DocumentTypeEnum.CPF
    );

    await expect(StoreService.saveStore(storeDTO)).rejects.toThrow(
      "Documento inválido. Deve conter 11 dígitos para CPF ou 14 dígitos para CNPJ."
    );
  });

  it("deve lançar um erro para CNPJ inválido", async () => {
    const address = new AddressDTO(
      0,
      "12345678",
      "Rua Exemplo",
      "10",
      "",
      "Bairro",
      "Cidade",
      "UF"
    );
    const storeDTO = new StoreDTO(
      1,
      "Loja Inválida",
      "1234567800019",
      address,
      DocumentTypeEnum.CNPJ
    );

    await expect(StoreService.saveStore(storeDTO)).rejects.toThrow(
      "Documento inválido. Deve conter 11 dígitos para CPF ou 14 dígitos para CNPJ."
    );
  });
});
