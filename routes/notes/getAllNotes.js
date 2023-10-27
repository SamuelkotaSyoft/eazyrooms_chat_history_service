import express from "express";
import User from "../../models/userModel.js";

var router = express.Router();

//import middleware
import verifyToken from "../../helpers/verifyToken.js";

//import models
import Notes from "../../models/noteModel.js";

//get all tasks
router.get("/", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;

  const role = req.user_info.role;

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
    const user = await User.findOne({ uid: uid });

    //query
    let query = Notes.find({ user: user._id });

    //execute query
    const queryResult = await query.exec();
    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
