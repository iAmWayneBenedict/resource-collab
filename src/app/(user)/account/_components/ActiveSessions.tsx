"use client";

import { authClient } from "@/config/auth";
import { useAlertDialog, useAuthUser } from "@/store";
import {
	addToast,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Spinner,
} from "@heroui/react";
import { Chrome, Globe, Laptop, Smartphone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import { AnimatePresence, motion } from "motion/react";

type Session = {
	id: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	ipAddress: string;
	userAgent: string;
	userId: string;
	token: string;
};

const getDeviceInfo = (userAgent: string) => {
	const parser = new UAParser(userAgent);
	const browser = parser.getBrowser();
	const os = parser.getOS();
	const device = parser.getDevice();

	return {
		deviceName: device.model || os.name || "Unknown Device",
		browser: browser.name || "Unknown Browser",
		deviceType: device.type === "mobile" ? "mobile" : ("web" as const),
	};
};

const getDeviceIcon = (type: "web" | "mobile") => {
	switch (type) {
		case "mobile":
			return <Smartphone className="h-5 w-5" />;
		default:
			return <Laptop className="h-5 w-5" />;
	}
};

const formatLastActive = (date: string) => {
	const now = new Date();
	const lastActive = new Date(date);
	const diffInSeconds = Math.floor(
		(now.getTime() - lastActive.getTime()) / 1000,
	);

	if (diffInSeconds < 60) return "Active now";
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400)
		return `${Math.floor(diffInSeconds / 3600)}h ago`;
	return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const ActiveSessions = () => {
	const setAlertDialogDetails = useAlertDialog(
		(state) => state.setAlertDialogDetails,
	);
	const setAuthUser = useAuthUser((state) => state.setAuthUser);
	const [sessions, setSessions] = useState([] as Session[]);
	const [currentSessionId, setCurrentSessionId] = useState("");
	const [revokingSessionToken, setRevokingSessionToken] = useState(""); // Add this state for the session being revoked
	const [loadingAllSession, setLoadingAllSession] = useState(false);
	const [loadingSession, setLoadingSession] = useState(false);

	const fetchSessions = async () => {
		const sessions = await authClient.listSessions();
		setSessions(sessions.data as any[]);
	};
	const currentSession = async () => {
		const currentSession = await authClient.getSession();
		setCurrentSessionId(currentSession?.data?.session?.id || "");
	};

	useEffect(() => {
		fetchSessions();
		currentSession();
	}, []);
	const handleRevoke = async (sessionId: string) => {
		setAlertDialogDetails({
			isOpen: true,
			title: "Revoke Session",
			type: "danger",
			message: "Are you sure you want to revoke this session?",
			dialogType: "confirm",
			onConfirm: async () => {
				setLoadingSession(true);
				setRevokingSessionToken(sessionId); // Set the session being revoked
				await authClient.revokeSession({ token: sessionId });
				await fetchSessions();
				await currentSession();
				setRevokingSessionToken(""); // Reset the session being revoking after revoking is completed
				addToast({
					title: "Session Revoked",
					description: "You have been logged out on that device",
					color: "success",
				});
				setLoadingSession(false);
			},
		});
	};

	const handleRevokeAll = async () => {
		setAlertDialogDetails({
			isOpen: true,
			title: "Revoke Other Sessions",
			type: "danger",
			message: "Are you sure you want to revoke all other sessions?",
			dialogType: "confirm",
			onConfirm: async () => {
				setLoadingAllSession(true);
				await authClient.revokeOtherSessions();
				await fetchSessions();
				await currentSession();
				addToast({
					title: "Session Revoked",
					description:
						"You have been logged out on all other devices",
					color: "success",
				});
				setLoadingAllSession(false);
			},
		});
	};

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<Card className="border-none bg-default-50 shadow-none">
			<CardHeader>
				<div className="flex w-full flex-col items-start space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
					<div className="space-y-1">
						<h2 className="text-lg font-medium">Active Sessions</h2>
						<p className="text-sm text-default-500">
							Manage your active sessions across all devices.
						</p>
					</div>
					<Button
						color="danger"
						variant="flat"
						onPress={handleRevokeAll}
						startContent={
							loadingAllSession ? (
								<Spinner />
							) : (
								<Trash2 className="h-4 w-4" />
							)
						}
						radius="full"
						isDisabled={
							!sessions ||
							sessions.length <= 1 ||
							loadingAllSession
						}
					>
						{loadingAllSession ? "Revoking..." : "Revoke All"}
					</Button>
				</div>
			</CardHeader>
			<CardBody className="gap-4 overflow-visible">
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="flex flex-col gap-2"
				>
					<AnimatePresence mode="popLayout">
						{sessions?.map((session, index) => {
							const { deviceName, browser, deviceType } =
								getDeviceInfo(session.userAgent as string);
							const isCurrentDevice =
								session.id === currentSessionId;

							return (
								<motion.div
									key={session.id}
									variants={item}
									layout
									className="flex items-center justify-between rounded-2xl border border-default-200 bg-default-100/50 p-4"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{
										duration: 0.3,
										delay: 0.1 * (index + 1),
									}}
								>
									<div className="flex items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-default-200">
											{getDeviceIcon(
												deviceType as "web" | "mobile",
											)}
										</div>
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<h3 className="font-medium">
													{deviceName} ({browser})
												</h3>
												{isCurrentDevice && (
													<Chip
														size="sm"
														variant="flat"
														color="success"
														className="h-5 text-xs"
													>
														Current
													</Chip>
												)}
											</div>
											<div className="flex items-center gap-2 text-xs text-default-500">
												<Globe className="h-3 w-3" />
												<span>{session.ipAddress}</span>
												<span>•</span>
												<span>
													{formatLastActive(
														session.updatedAt as unknown as string,
													)}
												</span>
											</div>
										</div>
									</div>
									{!isCurrentDevice && (
										<Button
											color="danger"
											variant="light"
											onPress={() =>
												handleRevoke(session.token)
											}
											radius="full"
											size="sm"
											isLoading={
												loadingSession &&
												session.token ===
													revokingSessionToken
											}
										>
											{loadingSession &&
											session.token ===
												revokingSessionToken
												? "Revoking..."
												: "Revoke"}
										</Button>
									)}
								</motion.div>
							);
						})}
					</AnimatePresence>

					{(!sessions || sessions.length === 0) && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-default-200 p-8 text-center"
						>
							<div className="mb-4 rounded-full bg-default-100 p-3">
								<Globe className="h-6 w-6 text-default-500" />
							</div>
							<h3 className="font-medium">No Active Sessions</h3>
							<p className="mt-1 text-sm text-default-500">
								There are no other active sessions on your
								account.
							</p>
						</motion.div>
					)}
				</motion.div>
			</CardBody>
		</Card>
	);
};

export default ActiveSessions;
