
const socket = require("socket.io");

const crypto = require("crypto");
const ConnectionRequest = require("../models/ConnectionRequest");
const Message = require("../models/Message");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_"))
        .digest("hex");
};


const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", async ({ userId, targetUserId }) => {

            try {

                const connection = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
                    ],
                });
                if (!connection) {
                    socket.emit("error", { message: "You are not connected with this user" });
                    return;
                }

                const roomId = getSecretRoomId(userId, targetUserId);
                socket.join(roomId);
                console.log(`User ${userId} joined room ${roomId}`);

            } catch (error) {
                console.log("joinChat error", error.message);
                socket.emit("error", { message: "Failed connection" });
            }
        });

        socket.on("sendMessage", async ({ userId, targetUserId, text }) => {

            try {
                if (!text || !text.trim()) return;
                const savedMessage = await Message.create({
                    senderId: userId,
                    receiverId: targetUserId,
                    text: text.trim()
                });

                const populated = await savedMessage.populate("senderId", "firstName lastName photoUrl");
                const roomId = getSecretRoomId(userId, targetUserId);
                io.to(roomId).emit("messageReceived", {
                    _id: populated._id,
                    senderId: populated.senderId._id,
                    firstName: populated.senderId.firstName,
                    lastName: populated.senderId.lastName,
                    photoUrl: populated.senderId.photoUrl,
                    text: populated.text,
                    createdAt: populated.createdAt,
                });

            } catch (error) {
                console.error("sendMessage error ", err.message);
                socket.emit("error", { message: "Failed to send message" });
            }

        });
        

        socket.on("disconnect", () => { });
    });

};

module.exports = initializeSocket;