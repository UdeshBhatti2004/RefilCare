import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDb from "./db";
import Pharmacy from "@/models/pharmacyModel";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        await connectDb();

        const pharmacy = await Pharmacy.findOne({ email });
        if (!pharmacy || !pharmacy.password) return null;

        const isValid = await bcrypt.compare(password, pharmacy.password);
        if (!isValid) return null;

        return {
          id: pharmacy._id.toString(),
          email: pharmacy.email,
          name: pharmacy.name,
          pharmacyId: pharmacy._id.toString(), 
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.pharmacyId = (user as any).pharmacyId; 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.pharmacyId = token.pharmacyId as string; 
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
