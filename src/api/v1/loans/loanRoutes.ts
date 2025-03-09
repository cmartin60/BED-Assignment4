import express, { Router } from "express";
import { submitLoanRequest, getAllLoans,reviewLoanRequest, approveLoanRequest } from "./loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.post(
    "/user", 
    authenticate, 
    isAuthorized({ hasRole: ["user"] }), 
    submitLoanRequest
);


router.get(
    "/officer", 
    authenticate, 
    isAuthorized({ hasRole: ["officer"] }), 
    getAllLoans
);

router.put(
    "/officer/:id/review", 
    authenticate, 
    isAuthorized({ hasRole: ["officer"] }), 
    reviewLoanRequest
);


router.get(
    "/manager", 
    authenticate, 
    isAuthorized({ hasRole: ["manager"] }), 
    getAllLoans
);

router.put(
    "/manager/:id/approve", 
    authenticate, 
    isAuthorized({ hasRole: ["manager"] }), 
    approveLoanRequest
);

export default router;