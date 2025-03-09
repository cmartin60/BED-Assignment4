import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";

import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const submitLoanRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid } = req.params;

    try {
        if (uid) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const user: UserRecord = await auth.getUser(uid);

        res.status(HTTP_STATUS.CREATED).json(successResponse({ message: "Loan request received", user: user.uid }));
    } catch (error: unknown) {
        next(error);
    }
};

export const getAllLoans = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(HTTP_STATUS.OK).json(successResponse({ message: "List of all loans" }));
    } catch (error: unknown) {
        next(error);
    }
};

export const reviewLoanRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Loan ID is required" });
        }
        
        res.status(HTTP_STATUS.OK).json(successResponse({ message: `Loan ${id} reviewed successfully` }));
    } catch (error: unknown) {
        next(error);
    }
};

export const approveLoanRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Loan ID is required" });
        }
        
        res.status(HTTP_STATUS.OK).json(successResponse({ message: `Loan ${id} approved successfully` }));
    } catch (error: unknown) {
        next(error);
    }
};