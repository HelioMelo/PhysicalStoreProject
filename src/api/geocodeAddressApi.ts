import logger from "../utils/logger";
import axios from "axios";

const geocodeAddressApi = async (address: string) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
      }
    );

    if (response.status !== 200) {
      logger.error(`Error in geocoding request: ${response.statusText}`);
      throw new Error("Error in geocoding request.");
    }

    const data = response.data;
    if (data.length === 0) {
      logger.warn(`Coordinates not found for address: ${address}`);
      return null; // Retorna null se não encontrar coordenadas
    }

    logger.info(`Successful geocoding for address: ${address}`);
    return {
      latitude: data[0].lat,
      longitude: data[0].lon,
    }; // Retorna as coordenadas
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Geocoding error: ${error.message}`);
      throw error; // Propaga o erro
    } else {
      logger.error(`Geocoding error: An unknown error occurred.`);
      throw new Error("An unknown error occurred");
    }
  }
};

export { geocodeAddressApi };
