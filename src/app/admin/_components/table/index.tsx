import dynamic from "next/dynamic";
import Bottom from "./Bottom";
import Top from "./Top";
import { ComponentType } from "react";

// ! DO NOT EDIT this dynamic import. This is a workaround for hydration error between HeroUI and NextJS
// ! This disables the prerender of the component
const CustomTable = dynamic(
	() =>
		import("./Table") as unknown as Promise<{
			default: ComponentType<any>;
		}>,
	{ ssr: false },
);
export { CustomTable, Bottom, Top };
