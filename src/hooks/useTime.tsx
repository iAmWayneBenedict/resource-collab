import { useState, useEffect } from "react";

type Params = {
	options: Intl.DateTimeFormatOptions;
	targetDate?: string;
};

/**
 * A React hook that returns a formatted string representing the current time.
 * @param {object} options Options for formatting the date and time. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#parameters|Intl.DateTimeFormat options}.
 * @param {string} targetDate Optional date string that will be used instead of the current date and time.
 * @returns {string} A formatted string representing the current time.
 */
const useTime = ({ options, targetDate = "" }: Params): string => {
	// State to store the formatted time string
	const [timeString, setTimeString] = useState("");

	// Function to handle formatting the current time
	const handleTime = () => {
		// Use the specified target date if provided, otherwise use the current date and time
		const now = targetDate ? new Date(targetDate) : new Date();

		// Format the date and time using the specified locale and options
		const locale = "en-PH";
		const formattedTime = new Intl.DateTimeFormat(locale, options).format(now);

		// Update the state with the formatted time string
		setTimeString(formattedTime);
	};

	useEffect(() => {
		// Call the handleTime function to format the initial time
		handleTime();

		// Create an interval to update the time every 1 second
		const interval = setInterval(() => {
			handleTime();
		}, 1000);

		// Clean up the interval when the component unmounts
		return () => clearInterval(interval);
	}, [options, targetDate]);

	return timeString;
};

export default useTime;
