import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import Nodemailer from "next-auth/providers/nodemailer";

// Directly assigning the environment variable values
const EMAIL_SERVER_USER = "smtp@mailtrap.io";
const EMAIL_SERVER_PASSWORD = "5c8de43e1846dbe345b8e5d308b4880f";
const EMAIL_SERVER_HOST = "live.smtp.mailtrap.io";
const EMAIL_SERVER_PORT = 587;
const EMAIL_FROM = "hello@demomailtrap.com";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: EMAIL_SERVER_HOST,
        port: EMAIL_SERVER_PORT,
        auth: {
          user: EMAIL_SERVER_USER,
          pass: EMAIL_SERVER_PASSWORD,
        },
      },
      from: EMAIL_FROM,
    }),
  ],
  pages:{
    verifyRequest:"/verify"
  }
});
