import path from "path";
import express from "express";
import cors from "cors";
import helmet, { contentSecurityPolicy } from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import productRoutes from "./route/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false })); // Set security-related HTTP headers
app.use(morgan("combined")); // log HTTP requests
app.use(express.json()); // Parse JSON bodies

//apply arcject rate-limit to all routes

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          error: "Too Many Request",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" }); //checking for bot
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }
    next();
  } catch (error) {
    console.log("ARCJET error " + error);
    next(error);
  }
});

app.use("/api/products", productRoutes); // Use product routes

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  // });
  app.get("/*splat", (req, res) => {
    // Or use app.all("/*splat", ...)
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

async function initDB() {
  try {
    // Test the database connection
    await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                image VARCHAR(255) NOT NULL,
                
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Initialize the database and start the server
// Ensure the database is initialized before starting the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  console.log("Database initialized");
});
