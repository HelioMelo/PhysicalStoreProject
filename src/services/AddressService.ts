import { zipCodeApi } from "../api/zipCodeApi";
import { geocodeAddressApi } from "../api/geocodeAddressApi";

export class AddressService {
  static async getFullAddress(
    zipCode: string,
    number?: string
  ): Promise<string> {
    const addressData = await zipCodeApi(zipCode);
    return `${addressData.logradouro}, ${number || "S/N"}, ${
      addressData.bairro
    }, ${addressData.localidade}, ${addressData.uf}`;
  }

  static async getCoordinates(
    address: string
  ): Promise<{ latitude: string; longitude: string }> {
    const coordinates = await geocodeAddressApi(address);
    if (!coordinates) {
      throw new Error("Não foi possível obter as coordenadas.");
    }
    return coordinates;
  }
}