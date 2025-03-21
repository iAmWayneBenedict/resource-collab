import { useModal } from "@/store";
import { Button, Image, Modal, ModalBody, ModalContent } from "@heroui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { favicon } from "../../../public/assets";
import { githubIcon, googleIcon } from "../../../public/assets/icons";
import { authClient } from "@/config/auth";

const AuthModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { name, onClose } = useModal();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (name === "auth-modal") {
			setIsOpen(true);
		}
	}, [name]);

	const onCloseModal = (state: boolean) => {
		setIsOpen(state);
		onClose();
	};

	const onClickSocial = async (provider: "google" | "github") => {
		setLoading(true);
		try {
			await authClient.signIn.social({
				provider,
				callbackURL: "/resources",
			});
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			size="sm"
		>
			<ModalContent>
				{() => (
					<>
						<ModalBody className="gap-1 rounded-2xl border border-default-200 p-8">
							<div className="flex flex-col items-center justify-center">
								{/* Purple circle with plus icon */}
								<div className="mb-8 flex items-center justify-center gap-2">
									<div className="w-12">
										<Image src={favicon.src} />
									</div>
									<span className="font-PlayFairDisplay text-lg font-black uppercase">
										Coollabs
									</span>
								</div>

								{/* Title */}
								<h2 className="mb-2 text-center font-PlayFairDisplay text-2xl font-bold">
									Unlock the full experience
								</h2>

								{/* Description */}
								<p className="mb-6 text-center text-sm text-default-600">
									Join us to discover and share premium
									resources in one collaborative platform.
								</p>

								{/* Google Sign In Button */}
								<Button
									onPress={() => onClickSocial("google")}
									className="mb-4 flex w-full items-center justify-center gap-2 border-1 py-3"
									variant="ghost"
									color="primary"
									radius="full"
									isDisabled={loading}
									startContent={
										<Image
											src={googleIcon.src}
											alt="Google"
											width={20}
											height={20}
										/>
									}
								>
									Continue with Google
								</Button>
								{/* Github Sign In Button */}
								<Button
									onPress={() => onClickSocial("github")}
									className="mb-4 flex w-full items-center justify-center gap-2 border-1 py-3"
									variant="ghost"
									color="primary"
									radius="full"
									isDisabled={loading}
									startContent={
										<div className="group">
											<Image
												src={githubIcon.src}
												alt="Github"
												width={20}
												height={20}
												className="transition-all duration-1000 group-hover:[filter:invert(1)]"
											/>
										</div>
									}
								>
									Continue with Github
								</Button>

								{/* Divider */}
								<div className="mb-4 flex w-full items-center">
									<div className="flex-1 border-t border-default-200"></div>
									<span className="mx-4 text-xs text-default-400">
										or
									</span>
									<div className="flex-1 border-t border-default-200"></div>
								</div>

								{/* Login/Signup Buttons */}
								<div className="mt-2 flex w-full flex-col gap-3">
									<Button
										as={Link}
										href="/auth/login"
										className="w-full bg-violet py-3 text-white"
										radius="full"
										isDisabled={loading}
									>
										Login
									</Button>
									<Button
										as={Link}
										href="/auth/signup"
										variant="ghost"
										radius="full"
										className="border-1"
										isDisabled={loading}
									>
										Sign Up
									</Button>
								</div>

								{/* Terms of Service */}
								<p className="mt-6 text-center text-xs text-default-400">
									By signing in, you agree to our{" "}
									<Link
										href="/terms"
										className="text-default-600 underline"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-default-600 underline"
									>
										Privacy Policy
									</Link>
								</p>
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default AuthModal;
