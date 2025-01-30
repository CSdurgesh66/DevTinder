
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

exports.getAllRequest = async(req,res) =>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId", "firstName lastName photoUrl");
        // .populate("fromUserId",["firstName","lastName"]);

        return res.status(200).json({
            success:true,
            message:"Fetched all user request",
            connectionRequests,
        })

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Error fetching user request",
        })
    }
}

exports.getAllConnections = async(req,res) =>{
    try{
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id, status:"accepted"},
                {toUserId:loggedInUser._id, status:"accepted"},
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

        const data = connections.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }else return row.fromUserId;
        })

        return res.status(200).json({
            success:true,
            message:"Fetched all user connections",
            data,
        })

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Error fetching user connections",
        })
    }
}

exports.getFeed = async(req,res) =>{
    try{
        const loggedInUser = req.user;

        const page = req.query.page  || 1;
        let limit = req.query.limit || 10;
        limit = limit>50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequests.forEach(req =>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());

        });
        // console.log(hideUserFromFeed);

        const users = await User.find({
            $and:[
                {_id:{ $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ],
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        return res.status(200).json({
            success:true,
            data:users
        })


    }catch(error){
        console.log(error.message);
        return res.status(400).json({
            success:false,
            message:"Failed to get feed",
        })
    }
}