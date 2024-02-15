import { Router } from 'express';
import { home } from "../controllers/PagesController.js";
import { isAuthenticated } from "../controllers/AuthenticationController.js";

const router = Router();

router.get("/",isAuthenticated, home);

export default router;