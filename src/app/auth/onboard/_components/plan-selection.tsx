import { useGetIPInfo } from "@/lib/queries/ip-info";
import { useGetSubscriptions } from "@/lib/queries/subscriptions";
import { FormData, Plan } from "@/types/forms";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Switch,
	Skeleton,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { Fragment } from "react";

interface PlanSelectionProps {
	data: FormData;
	errors?: Record<string, string>;
	onChange: (key: keyof FormData, value: any) => void;
}

export function PlanSelection({ data, errors, onChange }: PlanSelectionProps) {
	const ipInfo = useGetIPInfo();
	const subscriptionData = useGetSubscriptions();
	const isLoading = subscriptionData.isLoading || ipInfo.isLoading;
	const isPH = ipInfo.data?.data?.country === "PH";

	const handlePlanSelect = (plan: string) => {
		onChange("selectedPlan", plan);
	};
	return (
		<div className="flex flex-col gap-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Choose Your Plan</h2>
				<p className="text-default-500">
					Select the plan that best fits your needs
				</p>
			</div>

			<div className="flex items-center justify-center gap-3">
				<span
					className={
						data.billingType === "monthly"
							? "text-primary"
							: "text-default-500"
					}
				>
					Monthly
				</span>
				<Switch
					isSelected={data.billingType === "yearly"}
					size="lg"
					color="primary"
					onValueChange={(isYearly) =>
						onChange("billingType", isYearly ? "yearly" : "monthly")
					}
				/>
				<span
					className={
						data.billingType === "yearly"
							? "text-primary"
							: "text-default-500"
					}
				>
					Yearly
				</span>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{isLoading ? (
					<Fragment>
						{[1, 2, 3].map((index) => (
							<Card
								key={index}
								className="border-medium border-default-200"
								radius="lg"
							>
								<CardBody className="mt-4 flex h-full flex-col justify-between gap-6">
									<div className="space-y-6">
										<div className="space-y-2">
											<Skeleton className="h-6 w-24 rounded-lg" />
											<div className="flex items-baseline gap-1">
												<Skeleton className="h-8 w-20 rounded-lg" />
												<Skeleton className="h-4 w-16 rounded-lg" />
											</div>
										</div>
										<div className="space-y-2">
											{[1, 2, 3, 4, 5].map(
												(featureIndex) => (
													<div
														key={featureIndex}
														className="flex items-start gap-2"
													>
														<Skeleton className="h-5 w-5 rounded-full" />
														<Skeleton className="h-5 w-full rounded-lg" />
													</div>
												),
											)}
										</div>
									</div>
									<Skeleton className="h-10 w-full rounded-lg" />
								</CardBody>
							</Card>
						))}
					</Fragment>
				) : (
					<Fragment>
						{subscriptionData.data?.data?.map((plan: Plan) => {
							if (plan.type === "free") return null;

							const isSelected = data.selectedPlan === plan.type;
							const price = isPH
								? data.billingType === "monthly"
									? plan.monthly_price_local
									: plan.yearly_price_local
								: data.billingType === "monthly"
									? plan.monthly_price
									: plan.yearly_price;
							const isPremium = plan.type === "premium";
							const currencySymbol = isPH ? "₱" : "$";

							return (
								<Card
									key={plan.id}
									className={`border-medium transition-all ${
										isSelected
											? "border-primary bg-primary-50"
											: "border-default-200"
									}`}
									radius="lg"
								>
									{isPremium && (
										<div className="absolute -top-4 left-1/2 -translate-x-1/2">
											<div className="">
												<Chip
													className="border-small border-white bg-violet px-4 !pb-4 pt-7 text-lg font-bold text-white"
													color="primary"
													radius="full"
													size="lg"
													variant="solid"
												>
													Most Popular
												</Chip>
											</div>
										</div>
									)}
									<CardBody className="mt-4 flex h-full flex-col justify-between gap-6">
										<div className="space-y-6">
											<div className="space-y-2">
												<h3 className="text-xl font-semibold capitalize">
													{plan.type}
												</h3>
												<div className="flex items-baseline gap-1">
													<span className="text-3xl font-bold">
														{currencySymbol}
														{price}
													</span>
													<span className="text-default-500">
														/month
													</span>
												</div>
											</div>
											<ul className="space-y-2">
												{plan.features.map(
													(feature, index) => (
														<li
															key={index}
															className="flex items-start gap-2"
														>
															<Icon
																className="mt-1 min-w-[1.5rem] text-success"
																icon="lucide:check"
															/>
															<span className="text-sm lg:text-base">
																{feature}
															</span>
														</li>
													),
												)}
											</ul>
										</div>
										<Button
											className="w-full"
											color={
												isSelected
													? "primary"
													: "default"
											}
											radius="lg"
											variant={
												isSelected ? "solid" : "flat"
											}
											onPress={() =>
												handlePlanSelect(plan.type)
											}
											isDisabled={
												plan.type !== "early access"
											} // TODO: change to "free" after early access
										>
											{isSelected
												? "Selected"
												: "Select Plan"}
										</Button>
									</CardBody>
								</Card>
							);
						})}
					</Fragment>
				)}
			</div>

			{errors?.selectedPlan && (
				<p className="text-center text-small text-danger">
					{errors.selectedPlan}
				</p>
			)}
		</div>
	);
}
