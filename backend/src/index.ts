import express from "express";
import session from 'express-session';

import cors from 'cors';
import dotenv from "dotenv";
import { AddressInfo } from 'net';

import swaggerUi from 'swagger-ui-express';
import fs from 'fs/promises';
import { RegisterRoutes } from '../generated/routes';
import * as http from 'http';

declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
const server = http.createServer(app);

const sessionOptions: session.SessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));

RegisterRoutes(app);

// add swagger endpoint
app.use('/docs', swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
  const swaggerSpec = await fs.readFile('generated/swagger.json', 'utf-8');
  return res.send(swaggerUi.generateHTML(JSON.parse(swaggerSpec)));
});

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
});