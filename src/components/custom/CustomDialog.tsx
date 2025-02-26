"use client";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Divider,
	CircularProgress,
} from "@heroui/react";
import { Fragment, useEffect, useMemo } from "react";
import { CircleCheckBig, CircleX, CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAlertDialog } from "@/store";

/**
 * AlertDialog component that displays a modal with different statuses based on the context.
 * It uses the `useAppStore` hook to get details about the alert dialog,
 * and `useDisclosure` hook to manage its open/close state.
 *
 * The modal's appearance and behavior are determined by the `alertDialogDetails` context.
 * It supports success, error, warning, and info statuses, each with its own styling and icon.
 *
 * @returns {JSX.Element} A modal component that displays an alert dialog.
 */
const CustomAlertDialog = () => {
	const {
		alertDialogDetails: { onConfirm, onCancel, ...alertDialogDetails },
		reset,
	} = useAlertDialog();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();

	const onCloseHandler = () => {
		if (alertDialogDetails?.isOpen) reset();
		onClose();
	};

	useEffect(() => {
		if (alertDialogDetails?.isOpen) onOpen();
		else onCloseHandler();
	}, [alertDialogDetails]);

	const alertDialogStatusType =
		alertDialogDetails?.type as keyof typeof status;

	const handleClose = () => {
		if (alertDialogDetails?.actionLink)
			router.push(alertDialogDetails?.actionLink);

		if (onConfirm) onConfirm();

		onCloseHandler();
	};

	const handleCancel = () => {
		if (onCancel) onCancel();

		onCloseHandler();
	};

	const handleConfirm = () => {
		if (onConfirm) onConfirm();

		if (alertDialogDetails?.actionLink)
			router.push(alertDialogDetails?.actionLink);

		onCloseHandler();
	};

	const showCloseCancelButton =
		alertDialogDetails?.showClose ||
		alertDialogDetails?.showClose === undefined;

	const confirmColorButton = useMemo(() => {
		if (
			alertDialogStatusType === "loading" ||
			alertDialogStatusType === "info"
		) {
			return "primary";
		} else {
			return alertDialogStatusType;
		}
	}, [alertDialogStatusType]);
	return (
		<Modal
			backdrop={"blur"}
			isOpen={isOpen}
			placement="center"
			isDismissable={
				alertDialogDetails?.showClose ||
				alertDialogDetails?.showClose === undefined
			}
			isKeyboardDismissDisabled={!alertDialogDetails?.showClose}
			hideCloseButton={
				!alertDialogDetails?.showClose &&
				alertDialogDetails?.showClose !== undefined
			}
			onClose={handleClose}
		>
			<ModalContent>
				{() => (
					<Fragment>
						<ModalHeader
							className={cn(
								"flex flex-col gap-1 py-6",
								status[alertDialogStatusType]?.bg,
							)}
						>
							<div className="flex flex-col items-center gap-3">
								{status[alertDialogStatusType]?.icon}
								<h2 className="~text-lg/2xl">
									{alertDialogDetails?.title ||
										status[alertDialogStatusType]?.title}
								</h2>
							</div>
						</ModalHeader>
						<Divider />
						<ModalBody className="mt-5">
							{!alertDialogDetails?.showClose &&
								alertDialogDetails?.showClose !== undefined && (
									<center>
										<CircularProgress
											size="lg"
											aria-label="Loading..."
										/>
									</center>
								)}
							{Array.isArray(alertDialogDetails?.message) ? (
								alertDialogDetails?.message?.map(
									(message: string, index: number) => (
										<p
											key={"alert " + index}
											className="text-center"
										>
											{message || "Something went wrong!"}
										</p>
									),
								)
							) : (
								<p className="text-center">
									{alertDialogDetails?.message ||
										"Something went wrong!"}
								</p>
							)}
						</ModalBody>
						<ModalFooter>
							{alertDialogDetails?.dialogType !== "confirm" ? (
								showCloseCancelButton && (
									<Button
										color="default"
										variant="light"
										onPress={handleClose}
									>
										Close
									</Button>
								)
							) : (
								<Fragment>
									{showCloseCancelButton && (
										<Fragment>
											<Button
												color="default"
												variant="light"
												onPress={handleCancel}
											>
												Cancel
											</Button>
											<Button
												color={confirmColorButton}
												variant="solid"
												onPress={handleConfirm}
											>
												Confirm
											</Button>
										</Fragment>
									)}
								</Fragment>
							)}
						</ModalFooter>
					</Fragment>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CustomAlertDialog;

const status = {
	success: {
		title: "Success!",
		bg: "bg-green-500/5",
		icon: <CircleCheckBig className="h-16 w-16 text-green-500" />,
	},
	danger: {
		title: "Danger!",
		bg: "bg-red-500/5",
		icon: <CircleX className="h-16 w-16 text-red-500" />,
	},
	warning: {
		title: "Warning!",
		bg: "bg-yellow-500/5",
		icon: <CircleAlert className="h-16 w-16 text-yellow-500" />,
	},
	info: {
		title: "Info!",
		bg: "bg-blue-500/5",
		icon: <Info className="h-16 w-16 text-blue-500" />,
	},
	loading: {
		title: "Loading...",
		bg: "bg-blue-500/5",
		icon: <Info className="h-16 w-16 text-blue-500" />,
	},
};
