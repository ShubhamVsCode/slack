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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SignUpCardProps {
  setSignInFlow: (flow: SignInFlow) => void;
}

const SignUpCard = ({ setSignInFlow }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signIn("password", { name, email, password, flow: "signUp" });
    } catch (error) {
      console.log(`Error on sign up: ${error}`);
      setError("Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <Card className="max-w-3xl min-w-[400px]">
      <CardContent className="flex flex-col gap-4 p-8">
        <CardTitle className="text-xl font-bold">Create an Account</CardTitle>
        <CardDescription>Sign up with your email and password</CardDescription>
        {!!error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            disabled={isLoading}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            Sign Up
          </Button>
        </form>

        <Separator />
        <div className="flex flex-col gap-2.5">
          <Button
            variant="outline"
            className=""
            onClick={() => signIn("google")}
          >
            Sign up with Google
          </Button>
          <Button
            variant="outline"
            className=""
            onClick={() => signIn("github")}
          >
            Sign up with Github
          </Button>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Button
            size={"sm"}
            variant="link"
            className="text-sm"
            onClick={() => setSignInFlow("sign-in")}
          >
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
