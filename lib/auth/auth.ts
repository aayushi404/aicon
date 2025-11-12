import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../prisma";


const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ""
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ""
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true
    },

    socialProviders: {
        github: {
            clientId: GITHUB_CLIENT_ID,
            clientSecret:GITHUB_CLIENT_SECRET
        },
        google: {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret:GOOGLE_CLIENT_SECRET
        }
    }
});