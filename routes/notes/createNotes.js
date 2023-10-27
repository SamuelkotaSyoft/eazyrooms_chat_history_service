import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
var router = express.Router();

//import models
import Notes from "../../models/noteModel.js";
import User from "../../models/userModel.js";

//create chatbot
router.post("/", verifyToken, async function (req, res) {
  //request payload
  const uid = req.user_info.main_uid;
  const name = req.body.name;
  const description = req.body.description;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "userId is required" });
    return;
  }

  try {
    if (
      role !== "propertyAdmin" &&
      role !== "locationAdmin" &&
      role !== "storeAdmin"
    ) {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if user exists
    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid userId" });
      return;
    }

    //add address
    const task = new Notes({
      user: user._id,
      name: name,
      description: description,
      status: true,
    });

    //save address
    const writeResult = await task.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
