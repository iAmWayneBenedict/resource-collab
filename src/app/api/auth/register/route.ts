import { toStr } from "@/lib/utils";

export async function POST(request: Request) {
	const body = await request.json();

	return new Response(toStr(body), {
		status: 200,
	});
}
