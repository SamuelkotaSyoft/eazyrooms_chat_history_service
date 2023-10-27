import express from "express";
import ChatHistory from "../models/chatHistoryModel.js";

var router = express.Router();

//get user by id
router.get("/:chatId", async function (req, res) {
  //payload
  const chatId = req.params.chatId;

  //validate orderId
  if (!chatId) {
    return res.status(400).json({ status: false, error: "chatId is required" });
  }

  try {
    //query
    let query = ChatHistory.findOne({ chatId: chatId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult ?? [] });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
