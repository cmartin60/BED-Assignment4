import {
    getAllItems,
    getItemsByField,
} from "../src/api/v1/services/itemService";
import {
    getDocuments,
    getDocumentsByFieldValue,
} from "../src/api/v1/repositories/firestoreRepository";
import { Item } from "../src/api/v1/models/itemModel";
import {
    QuerySnapshot,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase-admin/firestore";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    getDocuments: jest.fn(),
    getDocumentsByFieldValue: jest.fn(),
}));
describe("Item Service", () => {
    describe("getAllItems", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return all items when the request is successful", async () => {
            // Mock data
            const mockDate = new Date();
            const mockDocs: QueryDocumentSnapshot[] = [
                {
                    id: "item1",
                    data: () =>
                        ({
                            name: "First Item",
                            description: "Description 1",
                            price: 10.99,
                            createdAt: mockDate,
                            updatedAd: mockDate,
                        } as DocumentData),
                } as QueryDocumentSnapshot,
                {
                    id: "item2",
                    data: () =>
                        ({
                            name: "Second Item",
                            description: "Description 2",
                            createdAt: mockDate,
                            updatedAd: mockDate,
                        } as DocumentData),
                } as QueryDocumentSnapshot,
            ];

            const mockSnapshot: QuerySnapshot = {
                docs: mockDocs,
            } as QuerySnapshot;

            (getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result: Item[] = await getAllItems();

            // Assertions
            expect(getDocuments).toHaveBeenCalledWith("items");
            expect(getDocuments).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(2);

            expect(result[0]).toEqual({
                id: "item1",
                name: "First Item",
                description: "Description 1",
                price: 10.99,
                createdAt: mockDate,
                updatedAd: mockDate,
            });

            expect(result[1]).toEqual({
                id: "item2",
                name: "Second Item",
                description: "Description 2",
                createdAt: mockDate,
                updatedAd: mockDate,
            });
        });
    });

    describe("getItemsByField", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return items matching the field value", async () => {
            // Mock data
            const mockDate = new Date();
            const mockFieldName = "category";
            const mockFieldValue = "electronics";
            const mockDocs: QueryDocumentSnapshot[] = [
                {
                    id: "item1",
                    data: () =>
                        ({
                            name: "Smartphone",
                            category: "electronics",
                            price: 599.99,
                            createdAt: mockDate,
                            updatedAt: mockDate,
                        } as DocumentData),
                } as QueryDocumentSnapshot,
                {
                    id: "item2",
                    data: () =>
                        ({
                            name: "Laptop",
                            category: "electronics",
                            price: 1299.99,
                            createdAt: mockDate,
                            updatedAt: mockDate,
                        } as DocumentData),
                } as QueryDocumentSnapshot,
            ];

            const mockSnapshot: QuerySnapshot = {
                docs: mockDocs,
            } as QuerySnapshot;

            (getDocumentsByFieldValue as jest.Mock).mockResolvedValue(
                mockSnapshot
            );

            const result: Item[] = await getItemsByField(
                mockFieldName,
                mockFieldValue
            );

            // Assertions
            expect(getDocumentsByFieldValue).toHaveBeenCalledWith(
                "items",
                mockFieldName,
                mockFieldValue,
                undefined
            );
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: "item1",
                name: "Smartphone",
                category: "electronics",
                price: 599.99,
                createdAt: mockDate,
                updatedAt: mockDate,
            });
            expect(result[1]).toEqual({
                id: "item2",
                name: "Laptop",
                category: "electronics",
                price: 1299.99,
                createdAt: mockDate,
                updatedAt: mockDate,
            });
        });

        it("should apply the limit when provided", async () => {
            // Mock data
            const mockDate = new Date();
            const mockFieldName = "status";
            const mockFieldValue = "active";
            const mockLimit = 1;
            const mockDocs: QueryDocumentSnapshot[] = [
                {
                    id: "item1",
                    data: () =>
                        ({
                            name: "Limited Item",
                            status: "active",
                            createdAt: mockDate,
                        } as DocumentData),
                } as QueryDocumentSnapshot,
            ];

            const mockSnapshot: QuerySnapshot = {
                docs: mockDocs,
            } as QuerySnapshot;

            (getDocumentsByFieldValue as jest.Mock).mockResolvedValue(
                mockSnapshot
            );

            const result: Item[] = await getItemsByField(
                mockFieldName,
                mockFieldValue,
                mockLimit
            );

            // Assertions
            expect(getDocumentsByFieldValue).toHaveBeenCalledWith(
                "items",
                mockFieldName,
                mockFieldValue,
                mockLimit
            );
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: "item1",
                name: "Limited Item",
                status: "active",
                createdAt: mockDate,
            });
        });

        it("should handle empty results by passing through the repository error", async () => {
            const mockFieldName = "category";
            const mockFieldValue = "nonexistent";

            const mockError = new Error(
                `No documents found in collection items where ${mockFieldName} == ${mockFieldValue}`
            );

            (getDocumentsByFieldValue as jest.Mock).mockRejectedValue(
                mockError
            );

            // Expect the service to pass through the error from the repository
            await expect(
                getItemsByField(mockFieldName, mockFieldValue)
            ).rejects.toThrow(mockError);

            expect(getDocumentsByFieldValue).toHaveBeenCalledWith(
                "items",
                mockFieldName,
                mockFieldValue,
                undefined
            );
        });

        it("should properly map document data to Item objects", async () => {
            // Test with different data structures to ensure mapping works correctly
            const mockDate = new Date();
            const mockFieldName = "isPromoted";
            const mockFieldValue = true;
            const mockDocs: QueryDocumentSnapshot[] = [
                {
                    id: "item1",
                    data: () =>
                        ({
                            name: "Promoted Item 1",
                            isPromoted: true,
                            tags: ["featured", "sale"],
                            metrics: { views: 1200, favorites: 340 },
                            createdAt: mockDate,
                        } as DocumentData),
                } as QueryDocumentSnapshot,
            ];

            const mockSnapshot: QuerySnapshot = {
                docs: mockDocs,
            } as QuerySnapshot;

            (getDocumentsByFieldValue as jest.Mock).mockResolvedValue(
                mockSnapshot
            );

            const result: Item[] = await getItemsByField(
                mockFieldName,
                mockFieldValue
            );

            // Assertions
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: "item1",
                name: "Promoted Item 1",
                isPromoted: true,
                tags: ["featured", "sale"],
                metrics: { views: 1200, favorites: 340 },
                createdAt: mockDate,
            });
        });
    });
});