import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

// when using middleware `hostname` and `port` must be provided below
const port = process.env.PORT || 8080;
const app = next({ dev: false });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Optional: adjust for security
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected socket ID:", socket.id);

    // Example broadcast
    socket.broadcast.emit("message", "world");

    // Custom event from client
    socket.on("update-morbi", (value) => {
      console.log("Received 'update-morbi':", value);
      socket.broadcast.emit("fetch-morbi-data", "true");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Server ready at http://localhost:${port}`);
    });
});

// app.prepare().then(() => {
//   const httpServer = createServer(handler);

//   const io = new Server(httpServer);

//   io.on("connection", (socket) => {
//     socket.broadcast.emit("message", "world");

//     socket.on("update-morbi", (value) => {
//       console.log("value => ", value);
//       socket.broadcast.emit("fetch-morbi-data", "true");
//     });

//     console.log("connted socket id => ", socket.id);
//   });

//   httpServer
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(process.env.PORT || 3000, () => {
//       console.log(`> Ready app`);
//     });
// });
