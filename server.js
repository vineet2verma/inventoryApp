import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.broadcast.emit("message", "world");

    socket.on("update-morbi", (value) => {
      console.log("value => ", value);
      socket.broadcast.emit("fetch-morbi-data", "true");
    });

    console.log("connted socket id => ", socket.id);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(process.env.PORT || 3000, () => {
      console.log(`> Ready app`);
    });
});
