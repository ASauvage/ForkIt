import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env.js";

export default defineConfig({
    schema: "./src/db/schemas/*",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: env.databaseUrl
    }
});
