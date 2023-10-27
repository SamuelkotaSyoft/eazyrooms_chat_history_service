import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import "./firebase-config.js";

const app = express();
const port = 3007;

app.use(cors());
app.use(express.json());

/**
 *
 * dotenv config
 */
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

/**
 *
 * connect to mongodb
 */
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
console.log("MONGODB CONNECTED...");

/**
 *
 * routes
 */

app.use("/getAllChats", (await import("./routes/getAllChats.js")).default);

app.use(
  "/saveChatHistory",
  (await import("./routes/saveChatHistory.js")).default
);

app.use(
  "/updateChatHistoryById",
  (await import("./routes/updateChatHistoryById.js")).default
);

app.use("/getChatById", (await import("./routes/getChatById.js")).default);

app.use(
  "/createNotes",
  (await import("./routes/notes/createNotes.js")).default
);
app.use(
  "/getAllNotes",
  (await import("./routes/notes/getAllNotes.js")).default
);
app.use(
  "/updateNotesById",
  (await import("./routes/notes/updateNotesById.js")).default
);
app.use(
  "/getNotesById",
  (await import("./routes/notes/getAllNotes.js")).default
);
app.use("/messages", (await import("./routes/chats/messages.js")).default);
app.use(
  "/notes/:chatId",
  (req, res, next) => {
    req.chatId = req.params.chatId;
    next();
  },
  (await import("./routes/chats/notes.js")).default
);
app.use("/chats", (await import("./routes/chats/chats.js")).default);

/**
 *
 * start listening to requests
 */
app.listen(port, () => {
  console.log(`Chat history service listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Chat History Service" });
});
