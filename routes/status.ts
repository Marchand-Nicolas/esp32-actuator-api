import { Memory } from "..";
import * as http from "http";

const handleStatus = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  MEMORY: Memory
) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      status: "ok",
      memory: MEMORY,
    })
  );
};

export default handleStatus;
