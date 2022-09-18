import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import User from "../models/User.js";
import { createError } from "../error.js";

// add cmt:
export const addComment = async (req, res, next) => {
  const newComment = new Comment(req.body);
  try {
    await newComment.save();
    return res.status(200).json(newComment);
  } catch (err) {
    return next(err);
  }
};

// update cmt:
// export const updateComment = async (req, res, next) => {
//   try {
//     const comment = await Comment.findById(req.params.id);
//     if (!comment) return next(createError(404, "Comment doesn't exist!"));

//     console.log(req.jwtPayload.id);

//     if (comment.userId === req.jwtPayload.id) {
//       const updatedComment = await Comment.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         {
//           new: true,
//         }
//       );
//       return res.status(200).json(updatedComment);
//     } else {
//       return next(createError(403, "You can only update your comments!"));
//     }
//   } catch (err) {
//     return next(err);
//   }
// };

// update cmt:
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(createError(404, "Comment doesn't exist!"));

    if (comment.userId === req.body.currentUserId) {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      return res.status(200).json(updatedComment);
    } else {
      return next(createError(403, "You can only update your comments!"));
    }
  } catch (err) {
    return next(err);
  }
};

// delete cmt:
// export const deleteComment = async (req, res, next) => {
//   try {
//     const comment = await Comment.findById(req.params.id);
//     const video = await Video.findById(comment.videoId);
//     if (
//       req.jwtPayload.id === comment.userId ||
//       video.userId === req.jwtPayload.id
//     ) {
//       await Comment.findByIdAndDelete(req.params.id);

//       return res.status(200).json("The comment has been deleted!");
//     } else {
//       return next(createError(403, "You can delete only your comments!"));
//     }
//   } catch (err) {
//     return next(err);
//   }
// };

// delete cmt:
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const video = await Video.findById(comment.videoId);
    if (!video) return next(createError(404, "Video not found 2!"));

    if (
      req.body.currentUserId === comment.userId ||
      video.userId === req.body.currentUserId
    ) {
      await Comment.findByIdAndDelete(req.params.commentId);

      return res.status(200).json("The comment has been deleted!");
    } else {
      return next(createError(403, "You can delete only your comments!"));
    }
  } catch (err) {
    return next(err);
  }
};

// get all comments of a video:
export const getAllComments = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return next(createError(404, "Video not found!"));

    const comments = await Comment.find({
      videoId: video._id,
    });

    if (comments.length === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(comments);
    }
  } catch (err) {
    return next(err);
  }
};
