import express from "express";
import {
  updateUser,
  getUser,
  deleteUser,
  subscribeUser,
  unsubscribeUser,
  likeVideo,
  dislikeVideo,
} from "../controllers/userController.js";
import { verifyToken, verifyUser } from "../verifyToken.js";

const router = express.Router();

// Update:
router.put("/:id", verifyUser, updateUser);

// Delete:
router.delete("/:id", verifyUser, deleteUser);

// Get one user:
// router.get("/find/:id", verifyUser, getUser);
router.get("/find/:id", getUser);

// Subscribe:
// router.put("/sub/:id", verifyToken, subscribeUser);
router.put("/sub/:id", subscribeUser);

// Unsubscribe:
// router.put("/unsub/:id", verifyToken, unsubscribeUser);
router.put("/unsub/:id", unsubscribeUser);

// Like a video:
// router.put("/like/:videoId", verifyToken, likeVideo);
router.put("/like/:videoId", likeVideo);

// Dislike a video:
// router.put("/dislike/:videoId", verifyToken, dislikeVideo);
router.put("/dislike/:videoId", dislikeVideo);

export default router;
