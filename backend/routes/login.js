import express from 'express';
import { loginuser} from "../controllers/login.js";

const router = express.Router();
router.post('/', loginuser);

export default router;