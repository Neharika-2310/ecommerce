import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Auth Admin
export async function GET(request) {
    try {
        const auth = getAuth(request);
        console.log('is-admin getAuth:', auth);
        const { userId } = auth;
        const isAdmin = await authAdmin(userId);
        console.log('is-admin result for', userId, isAdmin);

        if (!isAdmin) {
            return NextResponse.json(
                { error: "not authorized" },
                { status: 401 }
            );
        }

        return NextResponse.json({ isAdmin });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );
    }
}