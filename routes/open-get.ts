import { clientHeaders, Memory } from "..";
import * as http from "http";

const handleOpenGet = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  MEMORY: Memory
) => {
  const token = req.url?.split("?token=")[1];
  if (token !== process.env.TOKEN) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(`{"error": "Unauthorized"}`);
    return;
  }
  MEMORY.opening = true;
  res.writeHead(200, clientHeaders);
  res.end(`{"status": "ok"}`);
};

export default handleOpenGet;
