"use client";

import { useEffect } from "react";
import { useInView, Variants } from "framer-motion";

// Animation variants for different elements
export const fadeIn = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

export const fadeInUp = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

export const fadeInDown = {
	hidden: { opacity: 0, y: -40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

export const fadeInLeft = {
	hidden: { opacity: 0, x: -40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

export const fadeInRight = {
	hidden: { opacity: 0, x: 40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

export const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
} satisfies Variants;

export const scaleUp = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

// Custom hook for triggering animations when element is in view
export function useScrollAnimation(threshold = 0.1) {
	return (ref: React.RefObject<HTMLElement>) => {
		const isInView = useInView(ref, { once: true, amount: threshold });

		useEffect(() => {
			if (isInView && ref.current) {
				ref.current.style.transform = "none";
				ref.current.style.opacity = "1";
			}
		}, [isInView, ref]);

		return isInView;
	};
}
