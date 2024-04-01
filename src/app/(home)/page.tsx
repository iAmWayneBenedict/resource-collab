"use client";

import Banner from "./_components/Banner";
import Card from "./_components/Card";
import Contact from "./_components/Contact";
import { useRef } from "react";
import useAppTheme from "@/hooks/useAppTheme";
import Layout from "@/components/layouts/users/Layout";
import Container from "@/components/layouts/Container";

export default function Home() {
	const main = useRef<HTMLDivElement>(null);
	useAppTheme();
	return (
		<Layout refObject={main}>
			<Container>
				<Banner />

				<div className="grid grid-cols-1 grid-rows-1 gap-4 mt-16 lg:grid-cols-2 lg:grid-rows-2">
					{[1, 2, 3, 4].map((el) => (
						<Card key={el} />
					))}
				</div>
				<Contact />
			</Container>
		</Layout>
	);
}
