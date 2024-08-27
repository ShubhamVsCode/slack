import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { SignInFlow } from "../types";
import { useAuthActions } from "@convex-dev/auth/react";
import { AlertTriangle, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SignInCardProps {
  setSignInFlow: (flow: SignInFlow) => void;
}

const SignInCard = ({ setSignInFlow }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthActions();

  const handleSubmit = async (provider: "github" | "google") => {
    try {
      await signIn(provider);
    } catch (error) {
      console.log(`Error on sign in: ${error}`);
      setError("Invalid email or password");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch (error) {
      console.log(`Error on sign in: ${error}`);
      setError("Invalid email or password");
    }
  };

  return (
    <Card className="max-w-3xl min-w-[400px]">
      <CardContent className="flex flex-col gap-4 p-8">
        <CardTitle className="text-xl font-bold">Login to Continue</CardTitle>
        <CardDescription>Use your email and password to login</CardDescription>
        {!!error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            disabled={isLoading}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button type="submit">
            Continue
            {isLoading && <Loader className="animate-spin size-4 ml-2" />}
          </Button>
        </form>

        <Separator />
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={() => handleSubmit("google")}
            variant="outline"
            className=""
            disabled={isLoading}
          >
            Continue with Google{" "}
          </Button>
          <Button
            onClick={() => handleSubmit("github")}
            variant="outline"
            className=""
            disabled={isLoading}
          >
            Continue with Github{" "}
          </Button>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?
          </p>
          <Button
            size={"sm"}
            variant="link"
            className="text-sm"
            onClick={() => setSignInFlow("sign-up")}
          >
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
