import { clientHeaders, Memory } from "..";
import * as http from "http";

const handleStatus = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  MEMORY: Memory
) => {
  const token = req.headers["authorization"];
  const isfirstLoad = req.url.split("?firstLoad=")[1];
  if (token !== `Bearer ${process.env.TOKEN}`) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(`{"error": "Unauthorized"}`);
    return;
  }
  res.writeHead(200, clientHeaders);
  if (isfirstLoad === "true") {
    res.end(
      JSON.stringify({
        status: "ok",
        memory: MEMORY,
      })
    );
    return;
  }
  const INTERVAL = 10;
  const MAX_DURATION = 1000 * 10;
  let currentDuration = 0;
  const MEMORY_COPY = { ...MEMORY };
  const interval = setInterval(() => {
    const isDifferent = JSON.stringify(MEMORY) !== JSON.stringify(MEMORY_COPY);
    if (isDifferent || currentDuration >= MAX_DURATION) {
      clearInterval(interval);
      res.end(
        JSON.stringify({
          status: "ok",
          memory: MEMORY,
        })
      );
    }
    currentDuration += INTERVAL;
  }, INTERVAL);
};

export default handleStatus;
