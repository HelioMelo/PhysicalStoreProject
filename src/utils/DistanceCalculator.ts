import { Store } from "../models/store";
import { StoreDTO } from "../dto/storeDTO";
import { calculateDistance } from "./distanceUtils";

export class DistanceCalculator {
  static filterNearbyStores(
    stores: Store[],
    latitude: number,
    longitude: number,
    radius: number
  ): StoreDTO[] {
    const uniqueStores = new Set();
    return stores
      .filter(
        (store) => store.getLatitude() !== null && store.getLongitude() !== null
      )
      .map((store) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          store.getLatitude(),
          store.getLongitude()
        );
        const storeDTO = StoreDTO.fromStore(store, distance);
        storeDTO.distance =
          distance === 0 ? "0 km" : distance.toFixed(2) + " km";
        if (
          storeDTO.name &&
          storeDTO.address &&
          !uniqueStores.has(`${storeDTO.name}-${storeDTO.address}`)
        ) {
          uniqueStores.add(`${storeDTO.name}-${storeDTO.address}`);
          return storeDTO;
        }
        return null;
      })
      .filter((storeDTO): storeDTO is StoreDTO => storeDTO !== null)
      .filter(
        (storeDTO) =>
          storeDTO.distance !== undefined &&
          parseFloat(storeDTO.distance) <= radius
      )
      .sort(
        (a, b) => parseFloat(a.distance || "0") - parseFloat(b.distance || "0")
      );
  }
}
