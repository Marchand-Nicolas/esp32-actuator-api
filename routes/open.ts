import { clientHeaders, Memory } from "..";
import * as http from "http";

const handleOpen = async (
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
  /*const ip = MEMORY.ip;
  if (!ip) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(`{"error": "No IP found"}`);
    return;
  }
  const espUrl = `http://${ip}:${PROCESS.ENV.CARD_PORT}/trigger`;
  console.log(`Request for ${espUrl}`);
  const options = {
    method: "GET",
  };
  try {
    const espRes = await fetch(espUrl, options);
    const espText = await espRes.text();
    console.log(`ESP response: ${espText}`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(`{"status": "ok"}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(`{"error": "${error}"}`);
  }*/
  MEMORY.opening = true;
  res.writeHead(200, clientHeaders);
  res.end(`{"status": "ok"}`);
};

export default handleOpen;
