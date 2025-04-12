import { Server } from "socket.io";
import { createServer } from "http";
import { getAdminAccountData } from "../data/account/index.js";

const port = 3002;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store active connections (userId -> socketId)
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log(`✅ New connection: ${socket.id}`);

  // Store userId with socketId when they connect
  socket.on("user_connected", ({ userId }) => {
    if (userId) {
      userSockets.set(userId, socket.id);
      console.log(`📌 User ${userId} is now mapped to socket ${socket.id}`);
    }
  });

  // Handle disconnection (remove user from map)
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`✔ User ${userId} removed from active connections.`);
        break;
      }
    }
  });

  // Send notification by userId
  socket.on("admin_send_notification", ({ recipientUserId }) => {
    const recipientSocketId = userSockets.get(recipientUserId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_notification");
      console.log(`📩 Notification sent to ${recipientUserId}`);
    } else {
      console.log(`⚠️ User ${recipientUserId} is not connected.`);
    }
  });

    // Send notification by userId
    socket.on("user_send_notification", async () => {
      const admin_id = await getAdminAccountData();
      const recipientSocketId = userSockets.get(admin_id);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_notification");
        console.log(`📩 Notification sent to ${admin_id}`);
      } else {
        console.log(`⚠️ User ${admin_id} is not connected.`);
      }
    });
});

httpServer.listen(port, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${port}`);
});
