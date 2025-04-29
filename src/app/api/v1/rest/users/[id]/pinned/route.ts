import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApiHeaders } from "@/lib/utils";
import { findAllPinnedCollections } from "@/services/resource-collection-service";

export const GET = async (req: NextRequest) => {
	const session = await getSession(req.headers)	
	const user = session?.user
	
	if(!user) return NextResponse.json({message: "Unauthorized"}, {status: 401, headers: getApiHeaders(["GET"])})
	
	try {
		const pinned = await findAllPinnedCollections(user)
		
		
		return NextResponse.json({message: "Successfully retrieved pinned collection", data: pinned},{status: 200, headers: getApiHeaders(['GET'])})
	} catch(error) {
		console.log(error)
		
		return NextResponse.json({message: "Unauthorized"}, {status: 500, headers: getApiHeaders(['GET'])})
	}
}