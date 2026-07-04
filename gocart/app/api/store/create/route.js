import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import imagekit from "@/configs/imageKit";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const formData = await request.formData()


        const name = formData.get("name");
        const username = formData.get("username");
        const description = formData.get("description");
        const email = formData.get("email");
        const contact = formData.get("contact");
        const address = formData.get("address");
        const image = formData.get("image");
        if (!username||!name||!description||!email||!contact||!address||!image) {
            return NextResponse.json({ error: "missing sore info" }, { status: 400 })
        }


        const store = await prisma.store.findFirst({
            where: { userId: userId}
        })
        if (store) {
            return NextResponse.json({ status: store.status })
        }
        const isUsernameTaken = await prisma.store.findFirst({
            where: { username: username.toLowerCase() }
        })
        if (isUsernameTaken) {
            return NextResponse.json({ error: "Username is already taken" },
             { status: 400 })
        }

        const buffer=Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos",
        })
        const optimisedImage = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: "auto"},
                {format: "webp"},
                {width: '512'}
            ]
        })

        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                username: username.toLowerCase(),
                description,
                email,
                contact,
                address,
                logo: optimisedImage
            }
        })

        // link store to user
        await prisma.user.update({
            where: { id: userId },
            data: { store:{ id: newStore.id } }
        })

        return NextResponse.json({message:"applied,waiting for approval" })

    }catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message},{ status: 400 })
       
    }
}

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const store = await prisma.store.findFirst({
            where: { userId: userId }
        })

        if (store) {
            return NextResponse.json({status: store.status})     
        }

        return NextResponse.json({status: "not registered"})

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.code || error.message},{ status: 400 })
    }
}