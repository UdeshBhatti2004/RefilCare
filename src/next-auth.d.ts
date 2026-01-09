import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      pharmacyId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    pharmacyId: string;
  }
}
