import { clientHeaders, Memory } from "..";
import * as http from "http";

const handleStatus = async (
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
  res.writeHead(200, clientHeaders);
  res.end(
    JSON.stringify({
      status: "ok",
      memory: MEMORY,
    })
  );
};

export default handleStatus;
