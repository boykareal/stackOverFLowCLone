import { Models } from "appwrite";

export interface Question extends Models.Document{
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId:string;
}