import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserUsageStats } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getUserUsageStats(session.user.id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to get usage stats:", error);
    return NextResponse.json(
      { error: "Failed to get usage stats" },
      { status: 500 }
    );
  }
}
