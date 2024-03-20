import { db } from "@/db/connection";
import { users } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";

// To handle a GET request to /api
export async function GET(request: NextRequest, response: NextResponse) {
	const r = await db.select().from(users);
	console.log(r);
	return NextResponse.json({ message: "Hello World" });
}

// To handle a POST request to /api
export async function POST(request: NextRequest, response: NextResponse) {
	// Do whatever you want
	return NextResponse.json({ message: "Hello World" });
}
