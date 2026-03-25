
const Message = require('../models/Message');
const ConnectionRequest = require('../models/ConnectionRequest');

exports.getChatHistory = async (req, res) => {

    try {

        const loggedInuser = req.user;
        const { targetUserId } = req.params;

        const connection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: loggedInuser._id, toUserId: targetUserId, status: "accepted" },
                { fromUserId: targetUserId, toUserId: loggedInuser._id, status: "accepted" },
            ],
        });

        if (!connection) {
            return res.status(403).json({
                success: false,
                message: "Not connected users",
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip = (page - 1) * limit;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInuser._id, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: loggedInuser._id },
            ],
        })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .populate("senderId", "firstName lastName photoUrl")
            .populate("receiverId", "firstName lastName photoUrl");

        return res.status(200).json({
            success: true,
            messages,
            page,
            limit,
        });

    } catch (error) {
        console.log("getChatHistory error");
        return res.status(500).json({
            success: false,
            message: "failed to fetch chat history"
        })
    }
}