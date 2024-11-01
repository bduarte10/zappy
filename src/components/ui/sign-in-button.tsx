import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  provider: "google" | "facebook";
}
export function SignInButton({ provider }: SignInButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider, { redirectTo: "/dashboard" });
      }}
    >
      <Button variant="outline" className="w-full" type="submit">
        {provider === "google" && (
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        )}
        {provider === "facebook" && (
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 2h-15C3.122 2 2 3.122 2 4.5v15C2 20.878 3.122 22 4.5 22h7.5v-7h-2v-3h2v-1c0-2.761 2.239-5 5-5h3v3h-3c-1.104 0-2 .896-2 2v1h3l-1 3h-2l1 7h4.5c1.378 0 2.5-1.122 2.5-2.5v-15C22 3.122 20.878 2 19.5 2z"
              fill="#1877f2"
            />
          </svg>
        )}
        Entrar com {provider === "google" ? "Google" : "Facebook"}
      </Button>
    </form>
  );
}
