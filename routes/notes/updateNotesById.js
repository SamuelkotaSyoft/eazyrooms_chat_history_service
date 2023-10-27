import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import User from "../../models/userModel.js";

var router = express.Router();

//import models
import Notes from "../../models/noteModel.js";

//new buyer
router.patch("/:noteId", verifyToken, async function (req, res) {
  //request payload
  const uid = req.user_info.main_uid;
  const noteId = req.body.noteId;
  const name = req.body.name;
  const description = req.body.description;
  const nodes = req.body.nodes;
  const edges = req.body.edges;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "userId is required" });
    return;
  }

  //validate quantity
  if (!noteId) {
    res.status(400).json({ status: false, error: "noteId is required" });
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

    //check if note exists
    const note = await Notes.findById(noteId);
    if (!note) {
      res.status(400).json({ status: false, error: "Invalid note" });
    }

    //update user
    const writeResult = await Notes.updateOne(
      { _id: noteId },
      {
        $set: {
          name: name,
          description: description,
        },
      },
      { new: true }
    );

    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
