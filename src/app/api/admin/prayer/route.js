import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listPrayerRequests, updatePrayerRequest, deletePrayerRequest } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ requests: await listPrayerRequests() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin();
    const { id, status } = await request.json();
    return NextResponse.json({ requests: await updatePrayerRequest(id, { status }) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin();
    const { id } = await request.json();
    return NextResponse.json({ requests: await deletePrayerRequest(id) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
