import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authseller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; 



// toggle stock status of a product
export async function POST(request) {
    try{
        const{ userId }=getAuth(request)
        const productId = await request.json()
        
        if(!userId) {
            return new Response({ error: "missing details:ProductId" },{status: 400});
        }

        const storeId = await authSeller(userId)
        if(!storeId){
            return new Response({ error: "Unauthorized" },{status: 401})
        }
        //check if the product belongs to the store
        const product = await prisma.product.findFirst({
            where: {
                id: productId, storeId
            }
        })
        if(!product){
            return new Response({ error: "no product found" },{status: 404})
        }

        await prisma.product.update({
            where: {
                id: productId},
                data:{instock: !product.instock}
        })

        return NextResponse.json({ message: "Stock status updated successfully" }

        )

    }catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, 
            { status: 400 })
        
    }
}