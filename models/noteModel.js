import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    name: {
        type: String,
    },

    description: {
        type: String,
    },

    status: {
        type: Boolean,
    },
});

export default mongoose.model("Notes", noteSchema);
