import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

// update:
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    const { password, ...others } = updatedUser._doc;

    return res.status(200).json(others);
  } catch (err) {
    return next(err);
  }
};

// delete:
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("Deleted account successfully!");
  } catch (err) {
    return next(createError(403, "You can only delete your account!"));
  }
};

// getUser:
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const { password, ...others } = user._doc;

    return res.status(200).json(others);
  } catch (err) {
    return next(err);
  }
};

// subscribe:
export const subscribeUser = async (req, res, next) => {
  try {
    const [currentUser, user] = await Promise.all([
      await User.findById(req.body.currentUserId),
      await User.findById(req.params.id),
    ]);

    await currentUser.updateOne({
      $push: { subscribedUsers: user._id },
    });

    await user.updateOne({
      $inc: { subscribers: 1 },
    });

    return res.status(200).json("Subscribed successfully!");
  } catch (err) {
    return next(err);
  }
};

// unsubscribe:
export const unsubscribeUser = async (req, res, next) => {
  try {
    const [currentUser, user] = await Promise.all([
      await User.findById(req.body.currentUserId),
      await User.findById(req.params.id),
    ]);

    await currentUser.updateOne({
      $pull: { subscribedUsers: req.params.id },
    });

    await user.updateOne({
      $inc: { subscribers: -1 },
    });

    return res.status(200).json("Unsubscribe successfully!");
  } catch (err) {
    return next(err);
  }
};

// like:
// export const likeVideo = async (req, res, next) => {
//   try {
//     const userId = req.jwtPayload.id;
//     let video = await Video.findById(req.params.videoId);
//     if (!video) return next(createError(404, "Video not found!"));

//     await video.updateOne({
//       $addToSet: { likes: userId },
//       $pull: { dislikes: userId },
//     });

//     const updatedVideo = await Video.findById(video._id);

//     return res.status(200).json(updatedVideo);
//   } catch (err) {
//     return next(err);
//   }
// };

export const likeVideo = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId)
      return next(createError(403, "You must login to use this function!"));

    let video = await Video.findById(req.params.videoId);
    if (!video) return next(createError(404, "Video not found!"));

    await video.updateOne({
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });

    const updatedVideo = await Video.findById(video._id);

    return res.status(200).json(updatedVideo);
  } catch (err) {
    return next(err);
  }
};

// dislike:
// export const dislikeVideo = async (req, res, next) => {
//   try {
//     const userId = req.jwtPayload.id;
//     let video = await Video.findById(req.params.videoId);
//     if (!video) return next(createError(404, "Video not found!"));

//     await video.updateOne({
//       $addToSet: { dislikes: userId },
//       $pull: { likes: userId },
//     });

//     return res.status(200).json("You have disliked video!");
//   } catch (err) {
//     return next(err);
//   }
// };

export const dislikeVideo = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId)
      return next(createError(403, "You must login to use this function!"));

    let video = await Video.findById(req.params.videoId);
    if (!video) return next(createError(404, "Video not found!"));

    await video.updateOne({
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });

    return res.status(200).json("You have disliked video!");
  } catch (err) {
    return next(err);
  }
};
