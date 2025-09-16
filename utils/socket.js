
const socket = require("socket.io");

const crypto = require("crypto");

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
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            console.log("backend", userId);
            // const roomId = [userId, targetUserId].sort().join("_");
            const roomId = getSecretRoomId(userId, targetUserId);

            console.log(firstName, "Joined room ", roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
            // const roomId = [userId, targetUserId].sort().join("_");
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName, "->", text);
            io.to(roomId).emit("messageRecieved", { firstName, text });

        });


        socket.on("disconnect", () => { });
    });

};

module.exports = initializeSocket;