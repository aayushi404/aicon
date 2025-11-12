import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai"
import * as fs from "node:fs/promises"
import path from "node:path";
import saveImage from "./save";
import { content_type } from "@/lib/generated/prisma/enums";
import {config} from 'dotenv'

config()
/*
function isInlineDataPart(part: Part): part is Part & { inlineData: NonNullable<Part['inlineData']> } {
    return part.inlineData !== undefined;
}

export default async function generateImage(prompt:string, type:content_type) {
    // The SDK automatically looks for the GEMINI_API_KEY environment variable.
    const ai = new GoogleGenAI({});

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-image-generation", // The specific model for image generation
        contents: prompt,
    });

    const contentParts: Part[] | undefined = response.candidates?.[0]?.content?.parts;
    // Check if the response contains any parts (text or image)
    if (contentParts && contentParts.length > 0) {
        for (const part of contentParts) {
            if (part.text) {
                // Log any text output from the model (e.g., descriptions)
                console.log("Text output:", part.text);
            } else if (isInlineDataPart(part)) {
                // Handle the image data
                const imageData = part.inlineData.data;
                if (imageData) {
                    const imageUrl = await saveImage({ base64ImageData: imageData, type: type })
                    if (imageUrl) {
                        return imageUrl
                    }
                } else {
                    console.error("Error: Image data (Base64 string) was missing from the inlineData object.");
                }
                
            }
        }
    } else {
        console.error("Error: The response did not contain any parts.");

    }
}
    */

export default async function query(prompt:string, type:content_type) {
    const data = {sync_mode:true, prompt:prompt}
	const response = await fetch(
		"https://router.huggingface.co/fal-ai/fal-ai/qwen-image",
		{
			headers: {
				Authorization: `Bearer ${process.env.HF_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
    );
    console.log(response.body)
    const result = await response.blob();
    const buffer = Buffer.from(await result.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "storage");
    const filePath = path.join(uploadDir, "image.png");
    console.log(buffer)
    await fs.writeFile(filePath, buffer);
    return `/storage/image.png`;
    
}

