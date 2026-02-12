import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Sign in to your account
      </h1>

      <SignInForm />

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Create one
        </Link>
      </p>
    </Card>
  );
}
