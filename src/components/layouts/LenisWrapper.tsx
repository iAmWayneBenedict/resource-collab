"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ReactLenis } from "lenis/react";

type LenisType = {
	lenis: {
		raf: (time: number) => void;
	};
};

export default function LenisWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const lenisRef = useRef(null);

	useEffect(() => {
		function update(time: number) {
			(lenisRef.current as unknown as LenisType)?.lenis?.raf(time * 1000);
		}

		gsap.ticker.add(update);

		return () => {
			gsap.ticker.remove(update);
		};
	}, []);

	return (
		<ReactLenis
			ref={lenisRef}
			root
			options={{ lerp: 0.1, duration: 1.5, autoRaf: false }}
		>
			{children}
		</ReactLenis>
	);
}
