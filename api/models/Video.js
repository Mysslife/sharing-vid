import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VideoSchema = new Schema(
  {
    userId: { type: String, require: true },
    title: { type: String, require: true },
    desc: { type: String, require: true },
    img: { type: String, require: true },
    videoUrl: { type: String, require: true },
    views: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const VideoModel = mongoose.model("Video", VideoSchema);
export default VideoModel;
