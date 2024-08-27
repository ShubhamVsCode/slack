"use client";
import React, { useState } from "react";
import { SignInFlow } from "../types";
import SignInCard from "./sign-in-card";
import SignUpCard from "./sign-up-card";

const AuthScreen = () => {
  const [signInFlow, setSignInFlow] = useState<SignInFlow>("sign-in");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="">
        {signInFlow === "sign-in" ? (
          <SignInCard setSignInFlow={setSignInFlow} />
        ) : (
          <SignUpCard setSignInFlow={setSignInFlow} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
