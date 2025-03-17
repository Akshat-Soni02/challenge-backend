import express from 'express';
import {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  logChallengeStatus,
  getTodayLog,
} from "../controller/challengeController.js";
import {isAuthenticated} from "../middlewares/auth.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/')
  .post(isAuthenticated, createChallenge)
  .get(isAuthenticated, getChallenges);

router.route('/:id')
  .get(isAuthenticated, getChallengeById)
  .put(isAuthenticated, updateChallenge)
  .delete(isAuthenticated, deleteChallenge);

router.route('/:id/log')
  .post(isAuthenticated, upload.single("media"), logChallengeStatus)
  .get(isAuthenticated, getTodayLog);

export default router;
