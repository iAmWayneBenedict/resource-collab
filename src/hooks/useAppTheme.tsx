import React from "react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const useAppTheme = () => {
	const { setTheme } = useTheme();
	useEffect(() => {
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
			console.log(event.matches);
			setTheme(event.matches ? "dark" : "light");
		});
	}, []);
};

export default useAppTheme;
