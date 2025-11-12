"use client"
import PromptSettings from "@/components/promptSettings";
import Screen from "@/components/screen"
import { useSession } from "@/lib/auth/auth-client";
import { useState } from "react";

export default function Playground() {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const { data: session } = useSession()
    console.log(session)
    return (
        <div>
            <PromptSettings setImageUrl={setImageUrl}/>
            <Screen imageUrl={ imageUrl } />
        </div>
    )
}