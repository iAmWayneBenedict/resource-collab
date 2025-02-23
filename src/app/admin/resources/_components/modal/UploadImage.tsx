import { usePostDeleteUploadThingFileMutation } from "@/lib/mutations/storage/uploadthing";
import { UploadButton } from "@/lib/storage/uploadthing";
import { Chip, Input, Switch } from "@heroui/react";
import { AnimatePresence, motion } from "motion/react";
import { Controller } from "react-hook-form";

type UploadImageResource = {
	name: string;
	watch: any;
	clearErrors: any;
	setValue: any;
	isDisableForm: boolean;
	setShowUploadButtons: React.Dispatch<
		React.SetStateAction<{
			icon: boolean;
			thumbnail: boolean;
		}>
	>;
	showUploadButtons: any;
	control: any;
	setIsDisableForm: any;
	setFileIds: any;
	fileIds: any;
};
export const UploadImageResource = ({
	name,
	isDisableForm,
	setShowUploadButtons,
	clearErrors,
	setValue,
	watch,
	showUploadButtons,
	control,
	setIsDisableForm,
	setFileIds,
	fileIds,
}: UploadImageResource) => {
	const deleteImageMutation = usePostDeleteUploadThingFileMutation();
	return (
		<div>
			<div className="mb-1 flex justify-between">
				<Switch
					size="sm"
					isDisabled={!!isDisableForm}
					isSelected={showUploadButtons[name]}
					onValueChange={(state: boolean) =>
						setShowUploadButtons((prev) => ({
							...prev,
							[name]: state,
						}))
					}
				>
					Show upload button
				</Switch>
				<AnimatePresence mode="popLayout">
					{watch(name) && (
						<motion.div
							onClick={() => {
								setValue(name, "");
								clearErrors([name]);
								deleteImageMutation.mutate([fileIds[name]]);
							}}
							className="cursor-pointer"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								ease: "easeInOut",
								duration: 0.2,
							}}
						>
							<Chip size="sm" className="text-xs" variant="flat">
								Clear
							</Chip>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<div className={showUploadButtons[name] ? "hidden" : "flex"}>
				<Controller
					name={name}
					control={control}
					render={({ field, formState: { errors } }) => (
						<Input
							value={field.value as string}
							onValueChange={field.onChange}
							isInvalid={!!errors[name]}
							errorMessage={errors[name]?.message?.toString()}
							label={(name = " (optional)")}
							placeholder={`Enter ${name} url`}
							color={errors[name] ? "danger" : "default"}
							isDisabled={isDisableForm}
							classNames={{ label: "capitalize" }}
						/>
					)}
				/>
			</div>
			<div className={showUploadButtons[name] ? "mt-2 flex" : "hidden"}>
				<UploadButton
					endpoint="imageUploader"
					onClientUploadComplete={(res) => {
						// Do something with the response
						console.log("Files: ", res);
						setValue(name, res[0].ufsUrl);
						setIsDisableForm(false);
						setShowUploadButtons((prev) => ({
							icon: false,
							thumbnail: false,
						}));
						setFileIds((prev: any) => ({
							...prev,
							[name]: res[0].key,
						}));
					}}
					onUploadError={(error: Error) => {
						// Do something with the error.
						setIsDisableForm(false);
					}}
					onBeforeUploadBegin={(files) => {
						// Do something before the upload begins.
						if (fileIds[name])
							deleteImageMutation.mutate(
								Object.values(fileIds).filter((v) => v),
							);

						setIsDisableForm(true);
						return files;
					}}
				/>
			</div>
		</div>
	);
};
