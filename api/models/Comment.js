import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    userId: { type: String, require: true },
    videoId: { type: String, require: true },
    content: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;
