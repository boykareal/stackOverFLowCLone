import {Permission, DatabasesIndexType, OrderBy} from "node-appwrite"
import {db, questionCollection} from "../name"
import {databases} from "./config"


export default async function createQuestionCollection(){
    await databases.createCollection(db, questionCollection, questionCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users")
    ])
    console.log("Question collection is created")

    await Promise.all([
        databases.createStringAttribute(db, questionCollection, "title", 100, true),
        databases.createStringAttribute(db, questionCollection, "content", 10000, true),
        databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
        databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true),
        databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
    ])
    console.log("Questions Attributes created")

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await Promise.all([
        databases.createIndex({
            databaseId: db,
            collectionId: questionCollection,
            key: "title",
            type: DatabasesIndexType.Fulltext,
            attributes: ["title"],
            orders: [OrderBy.Asc],
        }),
        databases.createIndex({
            databaseId: db,
            collectionId: questionCollection,
            key: "content",
            type: DatabasesIndexType.Fulltext,
            attributes: ["content"],
            orders: [OrderBy.Asc]
        })
    ])
}