"use client";

import { bindReactHookFormError, cn } from "@/lib/utils";
import { usePostRegisterMutation, usePutUserMutation } from "@/services/api/mutations/users";
import { useModal } from "@/store";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Checkbox,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { Lock, Mail, User } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const baseSchema = z.object({
	name: z.string().min(4, "Name must be at least 4 characters long"),
	email: z.string().email("Invalid email address"),
	role: z
		.enum(["user", "admin", "guest"], {
			required_error: "Role is required",
		})
		.default("user"),
});

const passwordSchema = z.object({
	password: z
		.string()
		.min(8, "Password must be 8 characters with uppercase and symbol")
		.refine(
			(value) => {
				const hasUppercase = /[A-Z]/.test(value);
				const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value);
				return hasUppercase && hasSpecialCharacter;
			},
			{ message: "Password must be 8 characters with uppercase and symbol" }
		),
	confirm_password: z.string(),
});
const createSchema = baseSchema
	.merge(passwordSchema)
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});
const updateSchema = baseSchema.extend({
	password: z.string().optional(),
	confirm_password: z.string().optional(),
});

const UserFormModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [showPassword, setShowPassword] = useState(false);
	const queryClient = useQueryClient();

	const { name: modalName, onClose, data: dataModal, type } = useModal();

	const schema = type === "create" ? createSchema : updateSchema;

	const { control, handleSubmit, setError, reset } = useForm({
		defaultValues: {
			name: "",
			email: "",
			role: "user",
			password: "",
			confirm_password: "",
		},
		resolver: zodResolver(schema),
	});

	useEffect(() => {
		if (!dataModal) {
			reset({
				name: "",
				email: "",
				role: "user",
				password: "",
				confirm_password: "",
			});
			return;
		}

		reset({
			name: dataModal.name || "",
			email: dataModal.email || "",
			role: dataModal.role || "user",
			password: "",
			confirm_password: "",
		});
	}, [dataModal, reset]);

	const createMutation = usePostRegisterMutation({
		onSuccess: (data) => {
			console.log("success");
			queryClient.invalidateQueries(["users"] as InvalidateQueryFilters);
		},
		onError: (err) => {
			bindReactHookFormError(err, setError);
			console.log("error");
		},
	});

	const updateMutation = usePutUserMutation({
		params: dataModal?.id,
		onSuccess: (data: any) => {
			console.log("success");
			queryClient.invalidateQueries(["users"] as InvalidateQueryFilters);
		},
		onError: (err: any) => {
			bindReactHookFormError(err, setError);
			console.log("error");
		},
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setIsSubmitting(createMutation.isPending || updateMutation.isPending);
	}, [createMutation.isPending, updateMutation.isPending]);

	useEffect(() => {
		if (modalName === "userForm") onOpen();
	}, [modalName, onOpen]);

	const onCloseModal = () => {
		onOpenChange();
		onClose();
	};

	const onSubmit = (data: any) => {
		console.log(type);
		if (type === "update") {
			data["id"] = dataModal.id;
			updateMutation.mutate(data);
			return;
		}

		createMutation.mutate(data);

		console.log(data);
	};

	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onCloseModal}
			backdrop="blur"
			isDismissable={!isSubmitting}
		>
			<ModalContent>
				{() => (
					<form onSubmit={handleSubmit(onSubmit)}>
						<ModalHeader className="flex flex-col gap-1">
							<span>Create User</span>
							<p className="text-xs lg:text-sm font-normal">
								Will override the email verification from register
							</p>
						</ModalHeader>
						<ModalBody className="gap-4">
							<Controller
								name="name"
								control={control}
								render={({ field, formState: { errors } }) => (
									<Input
										value={field.value}
										onValueChange={field.onChange}
										isInvalid={!!errors.name}
										errorMessage={errors.name?.message}
										label="Name"
										placeholder="Enter your name"
										color={!!errors.name ? "danger" : "default"}
										isDisabled={isSubmitting}
										endContent={
											<User
												className={cn(
													"text-2xl text-default-400 pointer-events-none flex-shrink-0",
													!!errors.name && "text-red-500"
												)}
											/>
										}
									/>
								)}
							/>
							<Controller
								name="email"
								control={control}
								render={({ field, formState: { errors } }) => (
									<Input
										value={field.value}
										onValueChange={field.onChange}
										isInvalid={!!errors.email}
										errorMessage={errors.email?.message}
										label="Email"
										placeholder="Enter your email"
										color={!!errors.email ? "danger" : "default"}
										isDisabled={isSubmitting}
										endContent={
											<Mail
												className={cn(
													"text-2xl text-default-400 pointer-events-none flex-shrink-0",
													!!errors.email && "text-red-500"
												)}
											/>
										}
									/>
								)}
							/>
							<Controller
								name="role"
								control={control}
								render={({ field, formState: { errors } }) => (
									<Select
										selectedKeys={[field.value]}
										onChange={(e) => field.onChange(e.target.value)}
										isInvalid={!!errors.role}
										errorMessage={errors.role?.message}
										color={!!errors.role ? "danger" : "default"}
										label="Role"
										placeholder="Select your role"
										disallowEmptySelection
										isDisabled={isSubmitting}
									>
										<SelectItem key={"user"}>User</SelectItem>
										<SelectItem key={"admin"}>Admin</SelectItem>
										<SelectItem key={"guest"}>Guest</SelectItem>
									</Select>
								)}
							/>
							{type === "create" && (
								<Fragment>
									<Controller
										name="password"
										control={control}
										render={({ field, formState: { errors } }) => (
											<Input
												value={field.value}
												onValueChange={field.onChange}
												isInvalid={!!errors.password}
												errorMessage={errors.password?.message}
												label="Password"
												type={showPassword ? "text" : "password"}
												placeholder="Enter your password"
												color={!!errors.password ? "danger" : "default"}
												isDisabled={isSubmitting}
												endContent={
													<Lock
														className={cn(
															"text-2xl text-default-400 pointer-events-none flex-shrink-0",
															!!errors.password && "text-red-500"
														)}
													/>
												}
											/>
										)}
									/>
									<Controller
										name="confirm_password"
										control={control}
										render={({ field, formState: { errors } }) => (
											<Input
												value={field.value}
												onValueChange={field.onChange}
												isInvalid={!!errors.confirm_password}
												errorMessage={errors.confirm_password?.message}
												label="Confirm Password"
												type={showPassword ? "text" : "password"}
												placeholder="Enter confirm password"
												color={
													!!errors.confirm_password ? "danger" : "default"
												}
												isDisabled={isSubmitting}
												endContent={
													<Lock
														className={cn(
															"text-2xl text-default-400 pointer-events-none flex-shrink-0",
															!!errors.confirm_password &&
																"text-red-500"
														)}
													/>
												}
											/>
										)}
									/>
									<div className="flex py-2 px-1 justify-between">
										<Checkbox
											classNames={{ label: "text-small" }}
											onValueChange={(isChecked) =>
												setShowPassword(isChecked)
											}
										>
											Show Password
										</Checkbox>
									</div>
								</Fragment>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="default"
								variant="light"
								onPress={onCloseModal}
								isDisabled={isSubmitting}
							>
								Close
							</Button>
							<Button
								color="primary"
								className="bg-violet"
								type="submit"
								isLoading={isSubmitting}
							>
								{isSubmitting ? "Creating..." : "Create Account"}
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	);
};
export default UserFormModal;
