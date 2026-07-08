import { prisma } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Add new rating
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { orderId, productId, rating, review } = await request.json()

        if (!orderId || !productId || typeof rating !== "number") {
            return NextResponse.json(
                { error: "Missing or invalid rating data" },
                { status: 400 }
            )
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        const isAlreadyRated = await prisma.rating.findFirst({
            where: {
                productId,
                orderId,
            },
        })

        if (isAlreadyRated) {
            return NextResponse.json(
                { error: "Product already rated" },
                { status: 400 }
            )
        }

        const response = await prisma.rating.create({
            data: {
                userId,
                productId,
                rating,
                review,
                orderId,
            },
        })

        return NextResponse.json({
            message: "Rating added successfully",
            rating: response,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: error.code || error.message || "Server error" },
            { status: 500 }
        )
    }
}

// Get all reviews for the current user
export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const ratings = await prisma.rating.findMany({
            where: { userId },
        })

        return NextResponse.json({ ratings })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: error.code || error.message || "Server error" },
            { status: 500 }
        )
    }
}
