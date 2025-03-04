/**
 * Item Service (itemService.ts)
 *
 * This file defines functions (services) for managing item data. These functions
 * currently store items in-memory but could be extended to use a database.
 */

/**
 * @interface Item
 * @description Represents an item object.
 */
export type Item = {
    id: string;
    name: string;
    description: string;
};

const items: Item[] = [];

/**
 * @description Get all items.
 * @returns {Promise<Item[]>}
 */
export const getAllItems = async (): Promise<Item[]> => {
    return items;
};

/**
 * @description Create a new item.
 * @param {{ name: string; description: string; }} item - The item data.
 * @returns {Promise<Item>}
 */
export const createItem = async (item: {
    name: string;
    description: string;
}): Promise<Item> => {
    // the ... is the spread operator in js/ts and is the same as writing { name: item.name, description: item.description }
    const newItem: Item = { id: Date.now().toString(), ...item };

    // adding the new item to the global scoped array of Items
    items.push(newItem);
    return newItem;
};

/**
 * @description Update an existing item.
 * @param {string} id - The ID of the item to update.
 * @param {{ name: string; description: string; }} item - The updated item data.
 * @returns {Promise<Item>}
 * @throws {Error} If the item with the given ID is not found.
 */
export const updateItem = async (
    id: string,
    item: { name: string; description: string }
): Promise<Item> => {
    // retieve the item's index from the items array by comparing the item ids
    const index: number = items.findIndex((i) => i.id === id);
    // if the index is not found we expects a -1
    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    // assign the new value of the found index
    items[index] = { id, ...item };

    return items[index];
};

/**
 * @description Delete an item.
 * @param {string} id - The ID of the item to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the item with the given ID is not found.
 */
export const deleteItem = async (id: string): Promise<void> => {
    const index: number = items.findIndex((i) => i.id === id);
    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    // remove the item from the Item array, start the delete form the index and only delete 1 index
    items.splice(index, 1);
};