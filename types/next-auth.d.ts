import "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: ISODateString;
  }
}
