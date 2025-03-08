/**
 * Item Routes (itemRoutes.ts)
 *
 * This file defines the routes for managing items in our application.
 * It uses the Express framework for routing and makes calls to the item controller
 * (itemController.ts) to handle the logic for each route.
 */
import express, { Router } from "express";
import * as itemController from "../controllers/itemController";
import { validateRequest } from "../middleware/validate";
import { itemSchema, deleteItemSchema } from "../validation/itemValidation";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

// express Router instance created. This instance will group all the item-related routes.
const router: Router = express.Router();

// app.use("/api/v1/items", itemRoutes);

/**
 * @route GET /
 * @description Get all items.
 */
router.get("/", authenticate, itemController.getAllItems);

/**
 * @route GET /by-name/:name
 * @description Get items by name.
 *
 * @openapi
 * /api/v1/items/by-name/{name}:
 *   get:
 *     summary: Get items by name
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of items to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Maximum number of items to return
 *     responses:
 *       200:
 *         description: List of items matching the name
 *       404:
 *         description: No items found with the specified name
 *       500:
 *         description: Server error
 */
router.get("/by-name/:name", authenticate, itemController.getItemsByName);

/**
 * @route POST /
 * @description Create a new item.
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    validateRequest(itemSchema),
    itemController.createItem
);

/**
 * @route PUT /:id
 * @description Update an existing item.
 * @note This couyd be a bit of information I want to add
 *
 * @openapi
 * /api/v1/items/{id}:
 *   put:
 *     summary: Update an existing item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the item to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated item
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    validateRequest(itemSchema),
    itemController.updateItem
);

/**
 * @route DELETE /:id
 * @description Delete an item.
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    validateRequest(deleteItemSchema),
    itemController.deleteItem
);

export default router;