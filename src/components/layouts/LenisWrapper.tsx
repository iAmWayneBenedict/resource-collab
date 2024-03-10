"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

export default function LenisWrapper({ children }: { children: React.ReactNode }) {
	const lenisRef = useRef(null);

	useEffect(() => {
		function update(time: number) {
			lenisRef.current?.lenis?.raf(time * 1000);
		}

		gsap.ticker.add(update);

		return () => {
			gsap.ticker.remove(update);
		};
	}, []);

	return (
		<ReactLenis ref={lenisRef} autoRaf={false} root options={{ lerp: 0.1, duration: 1.5 }}>
			{children}
		</ReactLenis>
	);
}
