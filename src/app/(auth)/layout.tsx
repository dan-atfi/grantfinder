import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">GF</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">GrantFinder</span>
        </Link>
        <p className="mt-2 text-sm text-gray-600">
          Find UK business grants matched to your company
        </p>
      </div>
      {children}
    </div>
  );
}
