import imagekit from "@/configs/imageKit"
import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authseller"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// add a new product
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if (!storeId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }),
                { status: 401 })
        }

        // get the data from the form
        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const price = Number(formData.get("price"));
        const mrp = Number(formData.get("mrp"));
        const category = formData.get("category");
        const images = formData.getAll("image"); // ✅ get ALL files as an array

        if (!name || !description || !price || !mrp || !category || images.length < 1) {
            return new Response(JSON.stringify({ error: "missing product details" }),
                { status: 400 })
        }

        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products"
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: "webp" },
                    { width: "1024" }],
            })
            return url
        }))

        await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
                storeId
            }
        })

        return NextResponse.json({ message: "Product added successfully" })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message },
            { status: 400 })
    }
}

// get all products for a seller
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if (!storeId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }),
                { status: 401 })
        }

        const products = await prisma.product.findMany({
            where: { storeId }
        })

        return NextResponse.json({ products })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message },
            { status: 400 })
    }
}