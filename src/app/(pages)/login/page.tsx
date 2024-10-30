import { SignInButton } from "@/components/ui/sign-in-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default async function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo ao Zappy Bot</CardTitle>
          <CardDescription>Faça login para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Ao fazer login, você concorda com nossos Termos de Serviço e
            Política de Privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
