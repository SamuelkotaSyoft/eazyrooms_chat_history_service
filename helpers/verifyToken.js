import { getAuth } from "firebase-admin/auth";
import * as fs from "firebase-admin/firestore";
import userModel from "../models/userModel.js";

const fb = fs.getFirestore();

const verifyToken = async (req, res, next) => {
  const idToken = req.headers["eazyrooms-token"];
  var uid;
  var main_uid;
  var fb_info;

  if (idToken) {
    await getAuth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        fb_info = decodedToken;
        // console.log("decodedToken :>> ", decodedToken);
        try {
          uid = decodedToken.uid;
          if (decodedToken.uid) {
            main_uid = decodedToken.uid;
          }
          const user = userModel.findOne({ uid });
          req.user = {
            id: uid,
            org: "DKJNI9C0EI9",
          };
          await fb
            .collection("userAuth")
            .doc(uid)
            .get()
            .then((querySnapshot) => {
              req.user_info = querySnapshot.data();
              req.fb_info = fb_info;
              //if user id is null returning from here
              if (!req.user_info.main_uid)
                res
                  .status(403)
                  .json({ status: false, error: [{ msg: "Invalid UserId" }] });
              next();
            })
            .catch((err) => {
              console.log("EAZYROOMS_ID_TOKEN....[42]", err);

              res.status(403).json(err);
            });
        } catch (err) {
          console.log("EAZYROOMS_ID_TOKEN....[47]", err);

          // console.log("err :>> ", err);
          res.status(403).json(err);
        }
      })
      .catch((error) => {
        console.log("EAZYROOMS_ID_TOKEN....[54]", error);

        // console.log("error", error);
        res.status(403).json(error);
      });
  } else {
    res.status(403);
    res.end("Not Authorized");
  }
};

export default verifyToken;
