import { save_image } from "@/lib/types"
import * as fs from 'node:fs/promises'
import path from "path"

export default async function saveImage(saveImage: save_image) {
    try {
        const buffer: Buffer = Buffer.from(saveImage.base64ImageData, 'base64')
        const foldername = 'storage' + saveImage.type.toLowerCase() + 's'
        const imagename = `${Date.now()}.png`
        await fs.mkdir(foldername, { recursive: true })
        const filepath = path.join(foldername, imagename)
        await fs.writeFile(filepath, buffer)
        return filepath
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            throw new Error("Something went wrong while saving the image")
        }
    }
}