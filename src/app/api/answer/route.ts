import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import {UserPrefs} from "@/store/Auth"

function getErrorResponse(error: unknown, fallback: string) {
    const appwriteError = error as { message?: string; status?: number; code?: number };
    return NextResponse.json(
        { error: appwriteError.message || fallback },
        { status: appwriteError.status || appwriteError.code || 500 },
    );
}

export async function POST(request:NextRequest){
    try {
        const {questionId, answer, authorId} = await request.json();

        const response = await databases.createDocument(db, answerCollection, ID.unique(), {
            content: answer,
            authorId : authorId,
            questionId: questionId
        })

        const prefs = await users.getPrefs<UserPrefs>(authorId);
        const currentReputation = Number(prefs.reputation) || 0;
        await users.updatePrefs(authorId, {
            reputation: currentReputation + 1,
        });

        return NextResponse.json(response, {
            status: 201,
        });
    } catch (error: unknown) {
        return getErrorResponse(error, "Error creating answer");
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { answerId } = await request.json();

        const answer = await databases.getDocument(db, answerCollection, answerId);

        const response = await databases.deleteDocument(db, answerCollection, answerId);

        const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
        const currentReputation = Number(prefs.reputation) || 0;
        await users.updatePrefs(answer.authorId, {
            reputation: Math.max(0, currentReputation - 1),
        });

       return NextResponse.json(
        {data: response},
        {status: 200})
    } catch (error: unknown) {
        return getErrorResponse(error, "Error deleting the answer");
    }
}
