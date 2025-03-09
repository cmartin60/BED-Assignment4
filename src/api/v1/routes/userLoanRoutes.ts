import express, { Router } from "express";
import { userLoanPost } from "../controllers/userLoanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.post(
    "/:uid",
    authenticate,
    isAuthorized({ hasRole: ["user"], allowSameUser: true }),
    userLoanPost
);

export default router;