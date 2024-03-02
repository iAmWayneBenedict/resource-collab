import { useState, useEffect } from "react";

type Params = {
	options: Intl.DateTimeFormatOptions;
	targetDate?: string;
};

/**
 * A React hook that returns a formatted string representing the current time.
 * @param {object} options Options for formatting the date and time. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#parameters|Intl.DateTimeFormat options}.
 * @param {string=} [targetDate] (optional) The target date to be formatted. If not provided, the current date and time will be used.
 * @returns {string} A formatted string representing the current time.
 */
const useTime = ({ options, targetDate = "" }: Params) => {
	const [timeString, setTimeString] = useState("");

	const handleTime = () => {
		const now = targetDate ? new Date(targetDate) : new Date();
		const locale = "en-PH";
		const formattedTime = new Intl.DateTimeFormat(locale, options).format(now);
		setTimeString(formattedTime);
	};

	useEffect(() => {
		handleTime();
		const interval = setInterval(() => {
			handleTime();
		}, 1000);

		return () => clearInterval(interval);
	}, [options, targetDate]);

	return timeString;
};

export default useTime;
