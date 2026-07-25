import { Models } from "appwrite";

export interface Question extends Models.Document {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId: string;
    totalVotes?: number;
    totalAnswers?: number;
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
}

export interface Answer extends Models.Document {
    questionId: string;
    content: string;
    authorId: string;
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
    upvotesDocuments: Models.DocumentList<Vote>;
    downvotesDocuments: Models.DocumentList<Vote>;
    comments: Models.DocumentList<Comment>;
}

export interface Comment extends Models.Document {
    content: string;
    authorId: string;
    type: "question" | "answer";
    typeId: string;
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
}

export interface Vote extends Models.Document {
    votedById: string;
    voteStatus: "upvoted" | "downvoted";
    type: "question" | "answer";
    typeId: string;
}