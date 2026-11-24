import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { loadDepositPhoto } from "@/lib/persist";
import { getTransferOwner } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ depositId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { depositId } = await context.params;
  if (!/^[A-Za-z0-9_-]+$/.test(depositId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const owner = await getTransferOwner(depositId);
  if (!owner || owner.kind !== "mobile_deposit") {
    return new NextResponse("Not found", { status: 404 });
  }
  if (session.role === "member" && session.id !== owner.userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const photo = await loadDepositPhoto(depositId);
  if (!photo) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(photo.bytes), {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "private, max-age=60",
    },
  });
}
