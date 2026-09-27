import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

type VoteStatus = "upvoted" | "downvoted";
type ContentType = "question" | "answer";

function getErrorResponse(error: unknown, fallback: string) {
    const appwriteError = error as { message?: string; status?: number; code?: number };
    return NextResponse.json(
        { message: appwriteError.message || fallback },
        { status: appwriteError.status || appwriteError.code || 500 },
    );
}

export async function POST(request: NextRequest){
    try {
        const {votedById, voteStatus, type, typeId}: {
            votedById: string;
            voteStatus: VoteStatus;
            type: ContentType;
            typeId: string;
        } = await request.json();

        if (!votedById || !typeId || !["upvoted", "downvoted"].includes(voteStatus) || !["question", "answer"].includes(type)) {
            return NextResponse.json({ message: "Invalid vote request" }, { status: 400 });
        }

        const existingVotes = await databases.listDocuments(
            db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId",typeId),
                Query.equal("votedById",votedById)
            ]
        );
        const existingVote = existingVotes.documents[0];
        const targetCollection = type === "question" ? questionCollection : answerCollection;
        const content = await databases.getDocument(db, targetCollection, typeId);
        const authorPrefs = await users.getPrefs<UserPrefs>(content.authorId);
        let reputation = Number(authorPrefs.reputation) || 0;
        let document = null;

        if (existingVote) {
            await databases.deleteDocument(db, voteCollection, existingVote.$id);
            reputation += existingVote.voteStatus === "upvoted" ? -1 : 1;
        }

        if (!existingVote || existingVote.voteStatus !== voteStatus) {
            document = await databases.createDocument(db, voteCollection, ID.unique(), {
                type,
                typeId,
                voteStatus,
                votedById
            });
            reputation += voteStatus === "upvoted" ? 1 : -1;
        }

        await users.updatePrefs<UserPrefs>(content.authorId, { reputation });

        const [upvotes, downvotes] = await Promise.all([
          databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1),
          ]),
        ]);

        return NextResponse.json(
            {
                data: {
                    document,
                    voteResult: upvotes.total - downvotes.total,
                },
                message: "Vote handled"
            },
            {
                status: 200
            }
        )
    } catch (error: unknown) {
        return getErrorResponse(error, "Unable to update vote");
    }
}
