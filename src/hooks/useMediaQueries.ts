import { useMediaQuery } from "react-responsive";

export const useMobileScreen = () =>
	useMediaQuery({ query: "(max-width: 40rem)" });

export const useTabletOrSmallerScreen = () =>
	useMediaQuery({
		query: "(max-width: 64rem)",
	});
