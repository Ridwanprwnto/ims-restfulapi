import app from "./src/app.js";
import { serve } from "@hono/node-server";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set the port from environment variables or default to 4000
const PORT = Bun.env.PORT || 4000;

// Start the server
serve({ fetch: app.fetch, port: PORT });
