import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authseller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// toggle stock status of a product
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { productId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: "missing details: userId" }, { status: 400 });
        }

        const storeId = await authSeller(userId)
        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // check if the product belongs to the store
        const product = await prisma.product.findFirst({
            where: {
                id: productId, storeId
            }
        })
        if (!product) {
            return NextResponse.json({ error: "no product found" }, { status: 404 })
        }

        await prisma.product.update({
            where: {
                id: productId
            },
            data: { inStock: !product.inStock }
        })

        return NextResponse.json({ message: "Stock status updated successfully" })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}