'use client'
import { useSession } from '@clerk/nextjs'

export default function MultisessionAppSupport({ children }) {
    const { session } = useSession()
    return <div key={session ? session.id : 'no-user'}>{children}</div>
}