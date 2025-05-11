import { LoginForm } from "@/components/auth/login-form";
import React from "react";
import Image from "next/image";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center p-6 md:p-10">
      <div className="mb-8">
        <Image
          src="/kinetic-logo.png"
          alt="Kinetic AI Logo"
          width={100}
          height={100}
          className="mx-auto"
        />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      <div className="text-blue-200 text-sm mt-8">
        © {new Date().getFullYear()} Kinetic AI. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
