import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();

//import models
import Notes from "../../models/noteModel.js";

//get user by id
router.get("/:noteId", verifyToken, async function (req, res) {
  //payload
  const uid = req.user_info.main_uid;
  const noteId = req.params.noteId;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    return res.status(400).json({ status: false, error: "userId is required" });
  }

  //validate orderId
  if (!noteId) {
    return res.status(400).json({ status: false, error: "noteId is required" });
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
    //query
    let query = Notes.findOne({ _id: noteId, user: userId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
