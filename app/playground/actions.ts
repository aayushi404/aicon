"use server"
import { auth } from "@/lib/auth/auth";
import { generate_image, create_convo_request, create_convo_response } from "@/lib/types";
import axios from "axios";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { message_sender } from "@/lib/generated/prisma/enums";
import generateImage from "@/actions/imageGenerate/generate";

/*
export default async function g_image(params: generate_image) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        throw new Error("Authentication error");
        
    }

    const template_prompt = `style: ${params.style} \n\n`

    const BACKEND_URL = process.env.BACKEND_URL || ""
    const url = `${BACKEND_URL}/conversation`
    const body: create_convo_request = {
        ...params,
        prompt:`${params.prompt}\n ${template_prompt}`,
        userId: session.user.id
    }
    const Headers = {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${session.session.token}`
    }
    try {
        const response = await axios.post(url, body, {headers:Headers})

        if (response.status !== 200) {
            throw new Error("could not fetch the request")
        }
        
        const data: create_convo_response = await response.data

        const imagefile = data.image.split('/').slice(1).join("/")
        const STORAGE_URL = process.env.STORAGE_URL
        const image_url = `${STORAGE_URL}/${imagefile}`
        
        return image_url

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            throw new Error(error.message)
        }
    }

}
*/
export default async function generate(params: generate_image) {
    const session = await auth.api.getSession({ headers: await headers() })
    
    const template = `\nGenerate an ${params.type} whose theme is ${params.style}.`
    params.prompt = params.prompt + template
    
    try {
        const conversation = await prisma.conversation.create({
            data: {
                userId: session?.session.userId || '',
                description: params.description,
                type: params.type
            }
        })

        await prisma.message.create({
            data: {
                sender: message_sender.USER,
                content: params.prompt,
                conversationId: conversation.id
            }
        })

        const imageUrl = await generateImage(params.prompt, params.type)
        if (!imageUrl) {
            throw new Error("image could not get generated")
        }
        const aimsg = await prisma.message.create({
            data: {
                sender: message_sender.AI,
                conversationId: conversation.id
            }
        })

        const image = await prisma.image.create({
            data: {
                url: imageUrl,
                type: params.type,
                messageId: aimsg.id
            }
        })
        return image.url
    } catch (error){
        if (error instanceof Error) {
            console.log(error)
            new Error("something went wrong while generating the image")
        }
    }
}