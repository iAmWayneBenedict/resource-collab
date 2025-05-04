"use client";
import Container from "@/components/layouts/Container";
import Layout from "@/components/layouts/users/Layout";
import { Avatar, Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

const PublicCollections = () => {
	return (
		<Layout>
			<Container>
				<div className="flex items-center justify-between gap-4">
					<div className="flex flex-col gap-2">
						<h1 className="font-PlayFairDisplay text-3xl font-semibold">
							Page
						</h1>
						<div className="flex items-center gap-2">
							<Avatar
								name={"test"}
								src={undefined}
								className="h-5 w-5"
								size="sm"
							/>
							<p className="text-xs text-zinc-600 dark:text-zinc-400">
								{"test"}
							</p>
						</div>
					</div>
					<div>
						<Button
							as={Link}
							href="/auth/login"
							className="bg-violet text-white"
							radius="full"
						>
							Login now
						</Button>
					</div>
				</div>
			</Container>
		</Layout>
	);
};

export default PublicCollections;
