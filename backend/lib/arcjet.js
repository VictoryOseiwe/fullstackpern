import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";

// init arcjet
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    //Protects app from common attacks e.g SQL injection, XSS, CRSF attacks
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", //blocks all bots except search engine bots
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    //rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
