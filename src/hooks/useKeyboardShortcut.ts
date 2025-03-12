import { useEffect } from "react";

type KeyboardShortcutOptions = {
	ctrlKey?: boolean;
	altKey?: boolean;
	shiftKey?: boolean;
	key: string;
};

export const useKeyboardShortcut = (
	options: KeyboardShortcutOptions,
	callback: (e: KeyboardEvent) => void,
) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const matchesKey =
				event.key.toLowerCase() === options.key.toLowerCase();
			const matchesCtrl = options.ctrlKey ? event.ctrlKey : true;
			const matchesAlt = options.altKey ? event.altKey : true;
			const matchesShift = options.shiftKey ? event.shiftKey : true;

			if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
				event.preventDefault();
				callback(event);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [options, callback]);
};

// Example usage:
// useKeyboardShortcut({ ctrlKey: true, key: 'k' }, (e) => {
//   // Handle Ctrl+K
// });
