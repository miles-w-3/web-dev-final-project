import Express from "express";
import CORS from 'cors';
import dotenv from "dotenv";
import { AddressInfo } from 'net';

import swaggerUi from 'swagger-ui-express';
import fs from 'fs/promises';
import { RegisterRoutes } from '../generated/routes';
import * as http from 'http';


dotenv.config();

const app = Express();
app.use(CORS());
app.use(Express.json());
const server = http.createServer(app);

RegisterRoutes(app);

// add swagger endpoint
app.use('/docs', swaggerUi.serve, async (_req: Express.Request, res: Express.Response) => {
  const swaggerSpec = await fs.readFile('generated/swagger.json', 'utf-8');
  return res.send(swaggerUi.generateHTML(JSON.parse(swaggerSpec)));
});

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
});