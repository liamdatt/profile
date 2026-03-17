import type { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions) as NextApiHandler;

export default handler;
