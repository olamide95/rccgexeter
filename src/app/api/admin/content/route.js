import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readCollection, writeCollection, COLLECTIONS } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdmin();
    const name = new URL(request.url).searchParams.get("name");
    if (!COLLECTIONS.includes(name)) {
      return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
    }
    return NextResponse.json({ name, data: await readCollection(name) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}

export async function PUT(request) {
  try {
    await requireAdmin();
    const { name, data } = await request.json();
    if (!COLLECTIONS.includes(name)) {
      return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
    }
    await writeCollection(name, data);
    revalidatePath("/", "layout"); // every page re-reads on its next request
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 500 });
  }
}
