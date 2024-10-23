import express from "express";
import storeRoutes from "./routes/storeRoutes";
import dotenv from "dotenv";
import { createStoresTable } from "./db/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", storeRoutes);

const startServer = async () => {
  try {
    await createStoresTable();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
