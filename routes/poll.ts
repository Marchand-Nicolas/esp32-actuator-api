import { Memory } from "..";
import * as http from "http";

const handlePoll = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  MEMORY: Memory
) => {
  const ip = req.connection.remoteAddress?.split(":").pop();
  const url = req.url;
  console.log(`Request from ${ip} for ${url}`);
  const params = new URLSearchParams(url?.split("?")[1]);
  const battery = params.get("battery");
  if (battery) MEMORY.battery = parseFloat(battery);
  if (ip) MEMORY.ip = ip;
  MEMORY.lastPoll = Date.now();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(MEMORY.opening.toString());
  MEMORY.opening = false;
};

export default handlePoll;
