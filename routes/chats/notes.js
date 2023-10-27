import express from "express";
import mongoose from "mongoose";
import verifyToken from "../../helpers/verifyToken.js";
import Chat from "../../models/chat.model.js";
var router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  const { chatId } = req;
  // await connectToMongoDB();

  const chat = await Chat.findOne({
    _id: new ObjectId(chatId),
    active: true,
  });
  console.log({ chat });

  // await disconnectFromMongoDB();
  if (chat) {
    return res
      .status(200)
      .json({ status: 200, message: "Notes List", data: chat?.notes || [] });
  } else {
    return res
      .status(200)
      .json({ status: 200, message: "Notes Not found", data: [] });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  const { location } = req.body;
  const { chatId } = req;
  if (!location) {
    res
      .status(400)
      .json({ error: [{ status: false, msg: "location not Provided" }] });
  }

  const now = new Date();
  const utcTime = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  // await connectToMongoDB();

  const chat = await Chat.findOneAndUpdate(
    {
      _id: new ObjectId(chatId),
      org: location,
      active: true,
    },
    {
      $push: {
        notes: {
          message: req.body.message,
          time: utcTime,
          is_edited: false,
        },
      },
    },
    { new: true }
  );

  // await disconnectFromMongoDB();

  return res
    .status(200)
    .json({ status: 200, message: "Notes added successfully", data: chat });
});

router.put("/:id", verifyToken, async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  const { id } = req.params;
  const { chatId } = req;
  // await connectToMongoDB();

  const now = new Date();
  const utcTime = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  const chat = await Chat.findOneAndUpdate(
    {
      _id: new ObjectId(chatId),
      active: true,
      "notes._id": id,
    },
    {
      $set: {
        "notes.$": {
          message: req.body.message,
          time: utcTime,
          is_edited: true,
        },
      },
    },
    { new: true }
  );

  // await disconnectFromMongoDB();
  if (chat) {
    return res
      .status(200)
      .json({ status: 200, message: "Chat Notes updated", data: chat });
  } else {
    return res
      .status(404)
      .json({ status: 404, message: "Notes not found", data: chat });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  const { id } = req.params;
  const { chatId } = req;

  // await connectToMongoDB();

  const chat = await Chat.findOneAndUpdate(
    {
      _id: new ObjectId(chatId),
      active: true,
    },
    { $pull: { notes: { _id: id } } },
    { new: true }
  );

  // await disconnectFromMongoDB();
  if (chat) {
    return res
      .status(200)
      .json({ status: 200, message: "Chat Notes deleted", data: [] });
  } else {
    return res
      .status(404)
      .json({ status: 404, message: "Notes not found", data: [] });
  }
});

export default router;
