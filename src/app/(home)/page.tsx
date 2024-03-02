"use client";

import NavBar from "@/components/layouts/NavBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import backGroundGradient from "../../../public/assets/img/gradient-bg-4.png";
import { cn } from "@/lib/utils";
import { Playfair_Display } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import sampleLogo from "../../../public/assets/img/Group 50.png";
import { Input } from "@/components/ui/input";
import CustomInput from "@/components/custom/CustomInput";
import Banner from "./_components/Banner";
import Card from "./_components/Card";
import Contact from "./_components/Contact";
import Footer from "@/components/layouts/Footer";
import { DarkModeToggler } from "@/components/layouts/DarkModeToggler";
import useElementSize from "@/hooks/useElementSize";
import { useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import useAppTheme from "@/hooks/useAppTheme";
import Main from "@/components/layouts/Main";

const playfair = Playfair_Display({
	subsets: ["latin"],
	weight: "500",
});
export default function Home() {
	const main = useRef<HTMLElement>(null);
	useAppTheme();
	return (
		<Main refObject={main}>
			<NavBar />

			<div className="mx-24 mt-36">
				<Banner />
				{/* <div className="container-gradient">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div> */}

				<div className="mt-16 grid gap-4 grid-cols-2 grid-rows-2">
					{[1, 2, 3, 4].map((el) => (
						<Card key={el} />
					))}
				</div>
				<Contact />
			</div>
			<DarkModeToggler />
			<Footer />
		</Main>
	);
}
