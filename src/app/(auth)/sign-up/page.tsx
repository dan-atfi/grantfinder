import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Create your account
      </h1>

      <SignUpForm />

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
