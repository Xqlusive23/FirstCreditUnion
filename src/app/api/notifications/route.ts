import { getSession } from "@/lib/auth";
import { getNotifications } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json(
      { userId: null, notifications: [] },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const notifications = await getNotifications(session.id);
  return Response.json(
    { userId: session.id, notifications },
    { headers: { "Cache-Control": "no-store" } },
  );
}
