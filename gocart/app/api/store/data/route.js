import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get store info and store products
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json(
                { error: "missing username" },
                { status: 400 }
            );
        }

        // Get store info and in-stock products with ratings
        const storeData = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase(),
                isActive: true,
            },
            include: {
                Product: {
                    include: {
                        rating: true,
                    },
                },
            },
        });

        if (!storeData) {
            return NextResponse.json(
                { error: "no store found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            store: {
                ...storeData,
                product: storeData.Product,
            },
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );
    }
}