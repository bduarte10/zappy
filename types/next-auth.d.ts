import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string | null;
    userId?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: ISODateString;
  }
}
