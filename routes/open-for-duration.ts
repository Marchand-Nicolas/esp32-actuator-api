import { clientHeaders, Memory } from "..";
import * as http from "http";

const handleOpenForDuration = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  MEMORY: Memory
) => {
  const token = req.headers["authorization"];
  if (token !== `Bearer ${process.env.TOKEN}`) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(`{"error": "Unauthorized"}`);
    return;
  }
  const url = req.url;
  const durationStr = parseInt(url?.split("?")[1].split("=")[1] || "0");
  const duration = durationStr * 1000;
  const now = Date.now();
  MEMORY.keepOpenStart = now;
  MEMORY.keepOpenDuration = duration;
  res.writeHead(200, clientHeaders);
  res.end(`{"status": "ok"}`);
};

export default handleOpenForDuration;
