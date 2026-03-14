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
  // Opening is false, wait as much as possible (avoiding timeout)
  const INTERVAL = 10;
  const MAX_DURATION = 1000 * 60;
  let currentDuration = 0;
  const interval = setInterval(() => {
    const now = Date.now();
    const keepOpen =
      MEMORY.keepOpenStart &&
      now - MEMORY.keepOpenStart < MEMORY.keepOpenDuration;
    const open = MEMORY.opening || keepOpen;
    if (
      MEMORY.opening ||
      currentDuration >= MAX_DURATION ||
      (open && currentDuration >= 10)
    ) {
      clearInterval(interval);
      setTimeout(
        () => {
          res.end(open.toString());
          if (MEMORY.opening) MEMORY.opening = false;
        },
        keepOpen ? 500 : 0
      );
    }
    currentDuration += INTERVAL;
  }, INTERVAL);
};
export default handlePoll;
