import { useTheme } from "next-themes";
import { useEffect } from "react";

const useAppTheme = () => {
	const { setTheme, theme } = useTheme();

	useEffect(() => {
		const darkModeMediaQuery = window.matchMedia(
			"(prefers-color-scheme: dark)",
		);

		const handleColorSchemeChange = (event: { matches: boolean }) => {
			setTheme(event.matches ? "dark" : "light");
		};

		// Check if the user's system color scheme preference is dark on first load
		if (!theme) handleColorSchemeChange(darkModeMediaQuery);

		// Listen for changes in the system color scheme preference
		darkModeMediaQuery.addEventListener("change", handleColorSchemeChange);
	}, []);
};

export default useAppTheme;
