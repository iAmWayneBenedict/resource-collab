"use client";

import { useEffect, useState } from "react";
import AnimatedNumber from "./animated-number";

export default function StatsSection() {
	const [stats, setStats] = useState({
		users: 0,
		boosts: 0,
	});

	useEffect(() => {
		setStats({ users: 90, boosts: 56 });
	}, []);
	return (
		<section>
			<div className="py-24">
				<div className="mx-auto max-w-5xl px-6">
					<h2 className="sr-only">Coolabs in stats</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div className="space-y-0.5 md:text-center">
							<div className="text-4xl font-bold text-primary">
								<AnimatedNumber
									springOptions={{
										bounce: 0,
										duration: 2000,
									}}
									value={stats.users}
								/>
								+
							</div>
							<p className="text-muted-foreground">Users</p>
						</div>
						<div className="space-y-0.5 md:text-center">
							<div className="text-4xl font-bold text-primary">
								<AnimatedNumber
									springOptions={{
										bounce: 0,
										duration: 2000,
									}}
									value={stats.boosts}
								/>
								%
							</div>
							<p className="text-muted-foreground">
								Productivity Boost
							</p>
						</div>
						<div className="col-span-2 border-t pt-4 md:border-l md:border-t-0 md:pl-12 md:pt-0">
							<p className="text-balance text-lg text-muted-foreground">
								Our platform continues to grow with developers
								and businesses using productivity.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
