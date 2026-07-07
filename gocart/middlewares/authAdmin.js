import { clerkClient } from "@clerk/nextjs/server"

const authAdmin = async (userId) => {
    try {
        if (!userId) return false

        if (!process.env.ADMIN_EMAIL) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('authAdmin: ADMIN_EMAIL not set — allowing admin access in development');
                return true
            }
            return false
        }

        const client = await clerkClient()          // <-- call it as a function
        const user = await client.users.getUser(userId)   // <-- use the resolved client

        const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || ""
        const allowedAdmins = process.env.ADMIN_EMAIL
            .split(',')
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)

        return allowedAdmins.includes(email)

    } catch (error) {
        console.error(error)
        return false
    }
}

export default authAdmin