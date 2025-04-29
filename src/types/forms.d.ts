export interface Plan {
	id: number;
	type: string;
	monthly_price: string;
	yearly_price: string;
	description: string;
	features: string[];
	is_active: boolean;
	tier: number;
	limits: Record<string, number>;
	monthly_price_local: string;
	yearly_price_local: string;
}

export interface FormData {
	// Professional
	selectedProfessions: string[];
	customProfession: string;
	newsletter: boolean;

	// Affiliation
	affiliation: string;

	// Plan
	selectedPlan: string | null;
	billingType: "monthly" | "yearly";
}
