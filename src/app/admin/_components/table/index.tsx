import dynamic from "next/dynamic";
import Bottom from "./Bottom";
import Top from "./Top";

// ! DO NOT EDIT this dynamic import. This is a workaround for hydration error between HeroUI and NextJS
// ! This disables the prerender of the component
const CustomTable = dynamic(() => import("./Table"), { ssr: false });
export { CustomTable, Bottom, Top };
