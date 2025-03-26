"use client";

import { useAuthUser } from "@/store";
import { Avatar, Button } from "@heroui/react";
import { Cog, Settings } from "lucide-react";
import React from "react";

const UserProfile = () => {
	const { authUser } = useAuthUser();

	return (
		<div className="mt-20 flex items-center justify-center">
			<div className="flex justify-center gap-10">
				<Avatar
					name={authUser?.name}
					src={authUser?.image}
					fallback={authUser?.name?.charAt(0)?.toUpperCase()}
					isBordered
					classNames={{ base: "~w-16/24 ~h-16/24" }}
				/>
				<div className="mt-4 flex flex-col">
					<div className="flex flex-col gap-1">
						<h1 className="font-bold ~text-xl/3xl">
							{authUser?.name}
						</h1>
						<p className="text-sm text-gray-500">
							{authUser?.email}
						</p>
					</div>
					<div className="mt-4 flex gap-3">
						<Button
							variant="solid"
							radius="full"
							// className="bg-violet text-white"
						>
							Edit Profile
						</Button>
						<Button isIconOnly variant="light" radius="full">
							<Settings />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
