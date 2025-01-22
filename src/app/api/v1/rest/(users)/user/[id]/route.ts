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
