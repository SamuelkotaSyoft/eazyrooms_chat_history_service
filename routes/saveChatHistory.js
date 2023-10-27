import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import ChatHistory from "../models/chatHistoryModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//create chatbot
router.post("/", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;

  const variables = req.body.variables;
  const messages = req.body.messages;
  const locationId = req.body.locationId;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(404).json({ status: false, error: "uid is required" });
    return;
  }

  //validate variables
  if (!variables) {
    res.status(404).json({ status: false, error: "variables are required" });
    return;
  }

  //validate messages
  if (!messages) {
    res.status(404).json({ status: false, error: "messages are required" });
    return;
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if user exists
    const user = await User.findOne({ uid: uid });
    if (!user) {
      // console.log("NO USER");
      res.status(400).json({ status: false, error: "Invalid userId" });
      return;
    }

    //add address
    const chatHistory = new ChatHistory({
      property: user.property,
      location: locationId,
      variables: variables,
      messages: messages,
    });

    //save address
    const writeResult = await chatHistory.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

export default router;
