"use client";

import { FormData } from "@/types/forms";
import { Button, Image, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";
import { Preferences } from "./preferences";
import { Affiliation } from "./affiliation";
import { PlanSelection } from "./plan-selection";
import RowSteps from "./row-steps";
import { favicon } from "../../../../../public/assets";
import { usePostUserSubscriptionMutation } from "@/lib/mutations/user-subscriptions";

const INITIAL_FORM_DATA: FormData = {
	selectedProfessions: [],
	customProfession: "",
	affiliation: "",
	selectedPlan: "early access", // change to "free" after early access
	billingType: "monthly",
	newsletter: false,
};

const STEPS = [
	{ title: "Professional" },
	{ title: "Affiliation" },
	{ title: "Plan" },
];

function Walkthrough() {
	const [currentStep, setCurrentStep] = React.useState(0);
	const [formData, setFormData] = React.useState<FormData>(INITIAL_FORM_DATA);

	const [errors, setErrors] = React.useState<Record<string, string>>({});

	const handleChange = (key: keyof FormData, value: any) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[key];
				return newErrors;
			});
		}
	};

	const validateCurrentStep = () => {
		switch (currentStep) {
			case 0: // Professional
				if (!formData.selectedProfessions.length) {
					setErrors({
						selectedProfessions:
							"Please select at least one profession",
					});
					return false;
				}
				if (
					formData.selectedProfessions.includes("other") &&
					(!formData.customProfession ||
						formData.customProfession.length < 3)
				) {
					setErrors({
						customProfession:
							"Please enter your profession (at least 3 characters)",
					});
					return false;
				}
				return true;
			case 1: // Affiliation
				if (!formData.affiliation || formData.affiliation.length < 3) {
					setErrors({
						affiliation:
							"Please enter an affiliation with at least 3 characters",
					});
					return false;
				}
				return true;
			case 2: // Plan
				if (!formData.selectedPlan) {
					setErrors({ selectedPlan: "Please select a plan" });
					return false;
				}
				return true;
			default:
				return true;
		}
	};

	const handleNext = () => {
		if (!validateCurrentStep()) {
			return;
		}

		if (currentStep < STEPS.length - 1) {
			setCurrentStep((prev) => prev + 1);
			setErrors({});
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
			setErrors({});
		}
	};

	const mutation = usePostUserSubscriptionMutation({
		onSuccess: (data: any) => {
			location.href = "/dashboard?page=resources"; // redirect to dashboard
		},
		onError: (error: any) => {
			console.log(error);
		},
	});

	const handleSubmit = () => {
		if (!validateCurrentStep()) {
			return;
		}
		console.log("Form submitted:", formData);
		mutation.mutate(formData);
		// location.href = "/dashboard?page=resources";
	};

	const isCurrentStepValid = () => {
		switch (currentStep) {
			case 0: // Professional
				if (!formData.selectedProfessions.length) return false;
				if (
					formData.selectedProfessions.includes("other") &&
					(!formData.customProfession ||
						formData.customProfession.length < 3)
				) {
					return false;
				}
				return true;
			case 1: // Affiliation
				return formData.affiliation.length >= 3;
			case 2: // Plan
				return formData.selectedPlan !== null;
			default:
				return false;
		}
	};

	const renderStep = () => {
		switch (currentStep) {
			case 0:
				return (
					<Preferences
						data={formData}
						errors={errors}
						onChange={handleChange}
					/>
				);
			case 1:
				return (
					<Affiliation
						data={formData}
						errors={errors}
						onChange={handleChange}
					/>
				);
			case 2:
				return (
					<PlanSelection
						data={formData}
						errors={errors}
						onChange={handleChange}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
			<div className="w-full max-w-[800px] space-y-8">
				<div className="space-y-2 text-center">
					<h1 className="flex items-center justify-center gap-2 text-4xl font-bold">
						<div className="flex items-center">
							<Link href="/" className="flex items-center gap-2">
								<Image
									src={favicon.src}
									className="aspect-auto w-12"
									disableSkeleton
									disableAnimation
								/>
								<span className="flex font-PlayFairDisplay text-3xl font-black uppercase">
									Coollabs
								</span>
							</Link>
						</div>
					</h1>
				</div>

				<div className="space-y-8 rounded-xl bg-white p-6">
					<div className="flex justify-center">
						<RowSteps
							color="primary"
							currentStep={currentStep}
							steps={STEPS}
							onStepChange={setCurrentStep}
						/>
					</div>

					<div className="min-h-[400px]">{renderStep()}</div>

					<div className="flex justify-between pt-4">
						<Button
							className="min-w-[120px]"
							isDisabled={currentStep === 0}
							variant="ghost"
							onPress={handlePrevious}
							radius="full"
						>
							Previous
						</Button>
						{currentStep === STEPS.length - 1 ? (
							<Button
								className="min-w-[120px] bg-violet text-white"
								isDisabled={
									!isCurrentStepValid() || mutation.isPending
								}
								onPress={handleSubmit}
								radius="full"
								isLoading={mutation.isPending}
							>
								Submit
							</Button>
						) : (
							<Button
								className="min-w-[120px] bg-violet text-white"
								isDisabled={!isCurrentStepValid()}
								onPress={handleNext}
								radius="full"
							>
								Next
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Walkthrough;
