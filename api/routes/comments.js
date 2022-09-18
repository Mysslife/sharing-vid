import express from "express";
import { verifyToken, verifyUser } from "../verifyToken.js";
import {
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
} from "../controllers/commentController.js";

const router = express.Router();

// add:
// router.post("/", verifyToken, addComment);
router.post("/", addComment);

// update:
// router.put("/:id", verifyToken, updateComment);
router.put("/:commentId", updateComment);

// delete:
// router.delete("/:id", verifyToken, deleteComment);
router.delete("/:commentId", deleteComment);

// get all comments of a video:
router.get("/:videoId", getAllComments);

export default router;
