import express from "express";
import {
  createVideo,
  getVideo,
  updateVideo,
  updateVideoViews,
  deleteVideo,
  getRandomVideo,
  getSubscribedChannelAllVideos,
  getVideoByTitle,
  getVideoByTags,
  getAllVideos,
  getVideoForTrendingPage,
  getVideoForNewPage,
  getVideoForSubscribedPage,
} from "../controllers/videoController.js";
import { verifyToken, verifyUser } from "../verifyToken.js";

const router = express.Router();

// Create:
// router.post("/", verifyToken, createVideo);
router.post("/", createVideo);

// Delete:
router.delete("/:id", verifyToken, deleteVideo);

// Update Video:
router.put("/:id", verifyToken, updateVideo);

// Update Video Views:
router.put("/view/:id", updateVideoViews);

// Get ONE Video:
router.get("/find/:id", getVideo);

// Get ALL Videos:
router.get("/", getAllVideos);

// Get Random Video:
router.get("/random", getRandomVideo);

// Get Video By Title:
router.get("/search", getVideoByTitle);

// Get Video By Tags:
router.get("/tags", getVideoByTags);

// ============================================= PAGINATION:
// Get Video By Page - New Page:
router.get("/new", getVideoForNewPage);

// Get Video By Page - Trending Page:
router.get("/trending", getVideoForTrendingPage);

// Get Subscribed Channels ALL Video:
// router.get("/subscribed", verifyToken, getSubscribedChannelVideos);
router.get("/allSubscribedVideos/:userId", getSubscribedChannelAllVideos);

// Get Video By Page - Subscribed Page:
router.get("/subscribed/:userId", getVideoForSubscribedPage);

export default router;
