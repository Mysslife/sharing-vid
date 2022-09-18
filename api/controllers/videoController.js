import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

// create video:
export const createVideo = async (req, res, next) => {
  try {
    const video = new Video(req.body);
    await video.save();

    return res.status(200).json(video);
  } catch (err) {
    return next(err);
  }
};

// Update video:
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));

    if (video.userId === req.jwtPayload.id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      return res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can only update your video!"));
    }
  } catch (err) {
    return next(err);
  }
};

// Delete Video:
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));

    if (video.userId === req.jwtPayload.id) {
      await video.delete();
      return res.status(200).json("Deleted video successfully!");
    } else {
      return next(createError(403, "You can only delete your video!"));
    }
  } catch (err) {
    return next(err);
  }
};

// Get All Videos:
export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find();
    return res.status(200).json(videos);
  } catch (err) {
    return next(err);
  }
};

// Get Video:
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));

    return res.status(200).json(video);
  } catch (err) {
    return next(err);
  }
};

// Update Video Views:
export const updateVideoViews = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(updatedVideo);
  } catch (err) {
    return next(err);
  }
};

// get random video:
export const getRandomVideo = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([
      {
        $sample: { size: 20 },
      },
    ]);
    return res.status(200).json(videos);
  } catch (err) {
    return next(err);
  }
};

// // get subscribed channel videos:
// export const getSubscribedChannelVideos = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.jwtPayload.id);
//     if (!user) return next(createError(404, "User not found!"));

//     const list = await Promise.all(
//       user.subscribedUsers.map((subscribedUser) => {
//         return Video.find({ userId: subscribedUser });
//       })
//     );

//     return res
//       .status(200)
//       .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
//   } catch (err) {
//     return next(err);
//   }
// };

// get video by title:
export const getVideoByTitle = async (req, res, next) => {
  try {
    const title = req.query.title;

    const videos = await Video.find({
      title: { $regex: title, $options: "i" },
    }).limit(40); //-> limit lại không thì return hết toàn bộ thì quá nhiều -> hoặc return ra hết rồi trả về = pagination.

    if (videos.length === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(videos);
    }
  } catch (err) {
    return next(err);
  }
};

// get video by tags:
export const getVideoByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({
      tags: { $in: tags },
    }).limit(20);

    return res.status(200).json(videos);
  } catch (err) {
    return next(err);
  }
};

// ==================================== PAGINATION:
// Get Video By Page - New Page:
export const getVideoForNewPage = async (req, res, next) => {
  try {
    const page = Number(req.query.page);
    const limits = 6;
    const startIndex = (page - 1) * limits;

    const videos = await Video.find()
      .sort({
        createdAt: -1,
      })
      .limit(limits)
      .skip(startIndex);

    return res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// Get Video By Page - Trending Page:
export const getVideoForTrendingPage = async (req, res, next) => {
  try {
    const page = Number(req.query.page);
    const limits = 6;
    const startIndex = (page - 1) * limits;

    // const videos = await Video.find();
    // return res.status(200).json(videos.sort((a, b) => b.views - a.views)); // -> sort theo js không theo mongodb

    const videos = await Video.find()
      .sort({ views: -1 }) //-> sort theo mongodb. Giảm dần = -1. Tăng dần = 1.
      .limit(limits)
      .skip(startIndex);
    return res.status(200).json(videos);
  } catch (err) {
    return next(err);
  }
};

// get subscribed channel - ALL VIDEOS:
export const getSubscribedChannelAllVideos = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(createError(404, "User not found!"));

    const list = await Promise.all(
      user.subscribedUsers.map((subscribedUser) => {
        return Video.find({ userId: subscribedUser });
      })
    );

    return res
      .status(200)
      .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    return next(err);
  }
};

// Get Video By Page - Subscribed Page:
export const getVideoForSubscribedPage = async (req, res, next) => {
  try {
    const page = Number(req.query.page);
    const limits = 6;
    const startIndex = (page - 1) * limits;
    const endIndex = page * limits;

    const user = await User.findById(req.params.userId);
    if (!user) return next(createError(404, "User not found!"));

    const list = await Promise.all(
      user.subscribedUsers.map((subscribedUser) => {
        return Video.find({ userId: subscribedUser });
      })
    );

    return res.status(200).json(
      list
        .flat()
        .sort((a, b) => b.createdAt - a.createdAt)
        .splice(startIndex, endIndex)
    );
  } catch (err) {
    return next(err);
  }
};
