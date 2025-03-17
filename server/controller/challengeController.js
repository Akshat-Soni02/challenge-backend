import Challenge from "../models/challenge.js";
import { uploadMedia } from "../service/cloudinaryService.js";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { fetchTodayLog } from "../service/challengeService.js";

/**
 * @desc   Create a new challenge
 * @route  POST /api/challenges
 * @access Private (User-specific)
 */
export const createChallenge = async (req, res) => {
  try {
    const { title, completeDate, mediaRequired } = req.body;
    const userId = req.user.id;

    const challenge = await Challenge.create({
      title,
      completeDate,
      mediaRequired,
      userId,
      logs: [],
    });

    return res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Get all challenges for a user
 * @route  GET /api/challenges
 * @access Private (User-specific)
 */
export const getChallenges = async (req, res) => {
  console.log("getting challenges...");
  try {
    const userId = req.user._id;
    const { status } = req.query;
    console.log(status);
    const challenges = await Challenge.find({ userId, status }).sort({ createdAt: -1 });
    console.log(challenges);

    return res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Get a single challenge by ID
 * @route  GET /api/challenges/:id
 * @access Private (User-specific)
 */
export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge || challenge.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Update a challenge
 * @route  PUT /api/challenges/:id
 * @access Private (User-specific)
 */
export const updateChallenge = async (req, res) => {
  try {
    const { title, completeDate, mediaRequired } = req.body;
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge || challenge.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    challenge.title = title || challenge.title;
    challenge.completeDate = completeDate || challenge.completeDate;
    challenge.mediaRequired = mediaRequired ?? challenge.mediaRequired;

    await challenge.save();

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Delete a challenge
 * @route  DELETE /api/challenges/:id
 * @access Private (User-specific)
 */
export const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge || challenge.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    await challenge.deleteOne();

    res.status(200).json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Log daily challenge status (complete/failed & media upload)
 * @route  POST /api/challenges/:id/log
 * @access Private (User-specific)
 */
export const logChallengeStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const file = req.file;
      const challenge = await Challenge.findById(req.params.id);
  
      if (!challenge || challenge.userId.toString() !== req.user.id) {
        return res.status(404).json({ success: false, message: 'Challenge not found' });
      }

      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Check if a log already exists for today
      const existingLog = challenge.logs.find(log => log.date.toISOString().split('T')[0] === today);
      if(challenge.mediaRequired && !file && !existingLog) return res.status(400).json({
        message: "Media is required to log this challenge",
      });

      let media = null;
      if (file) {
        const mediaPath = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        // Generate a unique public_id using uuid
        console.log("mediaPath: ", mediaPath);
        const public_id = uuidv4() + "_" + today;
        const result = await uploadMedia({ mediaPath, folderName: "challengeAsset", public_id });
        if(!result) throw new Error("Error uplaoding media");
  
        // Store media details
        media = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }
  
      if (existingLog) {
        existingLog.status = status;
        if (media) existingLog.media = media; // Only update media if provided
      } else {
        challenge.logs.push({ date: new Date(), status, media });
      }
  
      await challenge.save();
  
      return res.status(200).json({ success: true, data: challenge });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getTodayLog = async (req, res) => {
    try {
      const { id } = req.params;
      const challenge = await Challenge.findById(id);
  
      if (!challenge) {
        return res.status(404).json({ success: false, message: "Challenge not found" });
      }
  
      const todayLog = await fetchTodayLog(challenge);
      if(!todayLog) console.log("no log for today in this challenge ", challenge._id);
      res.status(200).json({
        success: true,
        log: todayLog,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
