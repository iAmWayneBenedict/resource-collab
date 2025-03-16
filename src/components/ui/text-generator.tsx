"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";

// Split text into lines (simulating natural line breaks)
const splitTextIntoLines = (text: string) => {
	const words = text.split(" ");
	const lines = [];
	let currentLine = "";

	words.forEach((word) => {
		if (currentLine.length + word.length > 60) {
			lines.push(currentLine.trim());
			currentLine = word + " ";
		} else {
			currentLine += word + " ";
		}
	});

	if (currentLine.trim()) {
		lines.push(currentLine.trim());
	}

	return lines;
};

export function TextGenerator({ text }: { text: string }) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [visibleWords, setVisibleWords] = useState<string[]>([]);
	const [currentText, setCurrentText] = useState("");

	useLayoutEffect(() => {
		setIsGenerating(true);
		setVisibleWords([]);
		setCurrentText("");
	}, []);

	// Effect to handle text generation
	useEffect(() => {
		if (!isGenerating) return;

		// Split the text into words, preserving paragraph breaks
		const paragraphs = text.split("\n");
		const allWords: string[] = [];

		// Process each paragraph and add paragraph breaks
		paragraphs.forEach((paragraph, index) => {
			const words = paragraph
				.split(" ")
				.filter((word) => word.trim() !== "");
			allWords.push(...words);
			// Add paragraph break after each paragraph except the last one
			if (index < paragraphs.length - 1) {
				allWords.push("\n\n");
			}
		});

		let currentWordIndex = 0;

		const interval = setInterval(() => {
			if (currentWordIndex < allWords.length) {
				const wordToAdd = allWords[currentWordIndex];
				setVisibleWords((prev) => {
					const newWords = [...prev, wordToAdd];
					// Rebuild the full text for markdown preview
					const updatedText = rebuildTextFromWords(newWords);
					setCurrentText(updatedText);
					return newWords;
				});
				currentWordIndex++;
			} else {
				clearInterval(interval);
				setIsGenerating(false);
			}
		}, 150);

		return () => clearInterval(interval);
	}, [isGenerating, text]);

	// Function to rebuild text from words array
	const rebuildTextFromWords = (words: string[]): string => {
		let result = "";
		let isNewParagraph = true;

		words.forEach((word) => {
			if (word === "\n\n") {
				result += "\n\n";
				isNewParagraph = true;
			} else {
				if (isNewParagraph) {
					result += word;
					isNewParagraph = false;
				} else {
					result += " " + word;
				}
			}
		});

		return result;
	};

	return (
		<div className="relative space-y-4">
			<ReactMarkdown>{currentText}</ReactMarkdown>
		</div>
	);
}
