



import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// get store info and store products

export async function GET(request) {
    try{
        const{searchParams}=new URL(request.url)
        const usernames=searchParams.get("username").toLocaleLowerCase();
        if(!usernames){
            return NextResponse.json({ error: "missing username" },{status: 400});
        }
        // get store info and instock products with ratings
        const store= await prisma.store.findUnique({
            where:{username: usernames, isActive: true},
            include:{Products:{include:{ratings:true}}}
        })
        if(!store){
            return NextResponse.json({ error: "no store found" },{status: 400});
        }
        return NextResponse.json({ store })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, 
            { status: 400 })
    }
}