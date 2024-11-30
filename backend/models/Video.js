const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
