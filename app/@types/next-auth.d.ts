import "next-auth";

declare module "next-auth" {
  export interface User {
    id: string;
    name: string;
    email: string;
    bio: string;
    username: string;
    avatar_url: string;
  }

  interface Session {
    user: User;
  }
}
