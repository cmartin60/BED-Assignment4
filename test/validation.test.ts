import { Request, Response, NextFunction } from "express";
import { validate, validateRequest } from "../src/api/v1/middleware/validate";
import { itemSchema } from "../src/api/v1/validation/itemValidation";

interface Item {
    id?: string;
    name: string;
    description: string;
    price?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

describe("validate function for items", () => {
    it("should not throw an error for valid item data", () => {
        const data: Item = {
            name: "Test Item",
            description: "This is a test item",
            price: 99.99,
        };

        expect(() => validate(itemSchema, data)).not.toThrow();
    });

    it("should not throw an error for valid item data with optional fields", () => {
        const data: Item = {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Test Item",
            description: "This is a test item",
            price: 99.99,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        expect(() => validate(itemSchema, data)).not.toThrow();
    });

    it("should throw an error for missing name", () => {
        const data: Partial<Item> = {
            description: "This is a test item",
            price: 99.99,
        };

        expect(() => validate(itemSchema, data)).toThrow(
            "Validation error: Name is required"
        );
    });

    it("should throw an error for empty name", () => {
        const data: Item = {
            name: "",
            description: "This is a test item",
            price: 99.99,
        };

        expect(() => validate(itemSchema, data)).toThrow(
            "Validation error: Name cannot be empty"
        );
    });

    it("should throw an error for missing description", () => {
        const data: Partial<Item> = {
            name: "Test Item",
            price: 99.99,
        };

        expect(() => validate(itemSchema, data)).toThrow(
            "Validation error: Description is required"
        );
    });

    it("should throw an error for empty description", () => {
        const data: Item = {
            name: "Test Item",
            description: "",
            price: 99.99,
        };

        expect(() => validate(itemSchema, data)).toThrow(
            "Validation error: Description cannot be empty"
        );
    });

    it("should throw an error for negative price", () => {
        const data: Item = {
            name: "Test Item",
            description: "This is a test item",
            price: -10,
        };

        expect(() => validate(itemSchema, data)).toThrow(
            "Validation error: Price must be a positive number"
        );
    });
});

describe("validateRequest middleware for items", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should call next for valid item data", () => {
        req.body = {
            name: "Test Item",
            description: "This is a test item",
            price: 99.99,
        };

        validateRequest(itemSchema)(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 for missing name", () => {
        req.body = {
            description: "This is a test item",
            price: 99.99,
        };

        validateRequest(itemSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Name is required",
        });
    });

    it("should return 400 for empty name", () => {
        req.body = {
            name: "",
            description: "This is a test item",
            price: 99.99,
        };

        validateRequest(itemSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Name cannot be empty",
        });
    });

    it("should return 400 for missing description", () => {
        req.body = {
            name: "Test Item",
            price: 99.99,
        };

        validateRequest(itemSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Description is required",
        });
    });

    it("should return 400 for empty description", () => {
        req.body = {
            name: "Test Item",
            description: "",
            price: 99.99,
        };

        validateRequest(itemSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Description cannot be empty",
        });
    });

    it("should return 400 for negative price", () => {
        req.body = {
            name: "Test Item",
            description: "This is a test item",
            price: -10,
        };

        validateRequest(itemSchema)(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Validation error: Price must be a positive number",
        });
    });
});