// TS http server
import * as http from "http";
import { config } from "dotenv";
import * as fs from "fs";

config({
  path: "./.env.local",
});

export type Memory = {
  battery: number | null;
  ip: string | null;
  lastPoll: number | null;
};

const MEMORY: Memory = {
  battery: null,
  ip: null,
  lastPoll: null,
};

const routes = ["/poll", "/open", "/status"];

type RouteFunction = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  memory: Memory
) => String;

const routesFunctions: Record<string, RouteFunction> = {};

routes.forEach((route) => {
  const routeBase = `./routes${route}`;
  const routePath = fs.existsSync(`${routeBase}.ts`)
    ? `${routeBase}.ts`
    : `${routeBase}.js`;
  if (fs.existsSync(routePath)) {
    console.log(`=> Registering route ${route}`);
    import(routePath).then((module) => {
      routesFunctions[route] = module.default;
    });
  }
});

const server = http.createServer((req, res) => {
  const url = req.url;
  const route = url.split("?")[0];
  if (routesFunctions[route]) {
    return routesFunctions[route](req, res, MEMORY);
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
