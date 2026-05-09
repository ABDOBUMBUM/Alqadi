import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SETTING_KEY = "api_integrations";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    if (!setting) return NextResponse.json([]);
    const list = Array.isArray(setting.value) ? setting.value : [];
    // Never expose secrets fully – mask them
    const masked = list.map((api: any) => ({
      ...api,
      secret: api.secret ? "••••••••" + String(api.secret).slice(-4) : "",
    }));
    return NextResponse.json(masked);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch APIs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, label, endpoint, apiKey, secret, type, active = true } = body;
    if (!name || !label) return NextResponse.json({ error: "name and label are required" }, { status: 400 });

    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    const list: any[] = Array.isArray(setting?.value) ? (setting!.value as any[]) : [];

    if (list.find((a: any) => a.name === name)) {
      return NextResponse.json({ error: "API with this name already exists" }, { status: 409 });
    }

    const newApi = { id: crypto.randomUUID(), name, label, endpoint, apiKey, secret, type, active, createdAt: new Date().toISOString() };
    list.push(newApi);

    await prisma.siteSetting.upsert({
      where: { key: SETTING_KEY },
      create: { key: SETTING_KEY, value: list as any },
      update: { value: list as any },
    });

    return NextResponse.json({ success: true, id: newApi.id });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save API" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    const list: any[] = Array.isArray(setting?.value) ? (setting!.value as any[]) : [];
    const idx = list.findIndex((a: any) => a.id === id);
    if (idx === -1) return NextResponse.json({ error: "API not found" }, { status: 404 });

    // Don't overwrite secret if placeholder sent
    if (updates.secret?.startsWith("••••••••")) delete updates.secret;
    list[idx] = { ...list[idx], ...updates };

    await prisma.siteSetting.update({ where: { key: SETTING_KEY }, data: { value: list as any } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update API" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    const list: any[] = Array.isArray(setting?.value) ? (setting!.value as any[]) : [];
    const filtered = list.filter((a: any) => a.id !== id);

    await prisma.siteSetting.update({ where: { key: SETTING_KEY }, data: { value: filtered as any } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete API" }, { status: 500 });
  }
}
