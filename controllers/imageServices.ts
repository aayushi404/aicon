import type { generate_image as generate_image_type } from '../lib/types'
import { config } from 'dotenv'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'

config()

async function generate_image(params: generate_image_type) {
    const session = await auth.api.getSession({
        headers:await headers()
    })

    const template_prompt = `style: ${params.style} \n\n`

    const BACKEND_URL = process.env.BACKEND_URL || ""
}
