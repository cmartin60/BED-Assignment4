import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { getLoan } from "../controllers/officerLoanController";

const router: Router = express.Router();

router.get(
    "/:uid",
    authenticate,
    isAuthorized({ hasRole: ["officer"], allowSameUser: true }),
    getLoan
);

export default router;