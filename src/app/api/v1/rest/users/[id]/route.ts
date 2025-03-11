import { db } from "@/data/connection";
import { TUsers, users } from "@/data/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
	// try {
	// 	const users = await showUser(params.id);
	// 	return NextResponse.json(
	// 		{
	// 			message: "Success",
	// 			data: users,
	// 		},
	// 		{ status: 200 }
	// 	);
	// } catch (error) {
	// 	return NextResponse.json({ message: "Error", data: null }, { status: 500 });
	// }
};

// export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
//     try  {
//         const users = await showUser(params.id);

//         if(!users) return NextResponse.json({ message: "User not found", data: null }, { status: 404 });
//     } catch (error) {
//         return NextResponse.json({ message: "Error", data: null }, { status: 500 });
//     }
// };

export const PUT = async (req: NextRequest) => {
	try {
		const body: Partial<TUsers> = await req.json();

		await db
			.update(users)
			.set(body)
			.where(eq(users.id, body.id as string))
			.returning();

		return NextResponse.json(
			{ message: "User updated successfully", data: null },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return NextResponse.json({ message: "Error updating user", data: null }, { status: 400 });
	}
};
