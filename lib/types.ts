import { content_type } from "./generated/prisma/enums";

type create_convo_request = {
    userId: string;
    description: string;
    type: string;
    prompt: string;
}

type create_convo_response = {
    userId:string,
    imageId: string,
    image: string,
}

type generate_image = {
    prompt: string;
    style: string;
    description: string;
    type: content_type;
}

type save_image = {
    base64ImageData: string,
    type:content_type
} 
export type { create_convo_request, generate_image , create_convo_response, save_image};