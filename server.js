#!/usr/bin/env node
const path = require("path");
const express = require("express");
const compression = require("compression");
const { createRequestHandler } = require("expo-server/adapter/express");

const CLIENT_BUILD_DIR = path.join(process.cwd(), "dist/client");
const SERVER_BUILD_DIR = path.join(process.cwd(), "dist/server");

const app = express();
app.set("trust proxy", 1);
app.use(compression());
app.disable("x-powered-by");

app.get("/healthz", (_req, res) => {
  res.status(200).type("text/plain").send("ok");
});

// Static assets (client bundle)
app.use(
  express.static(CLIENT_BUILD_DIR, {
    immutable: true,
    maxAge: "365d",
    fallthrough: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }),
);

// Everything else (SSR + API routes)
app.all("*", createRequestHandler({ build: SERVER_BUILD_DIR }));

const port = Number(process.env.PORT || 8080);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
