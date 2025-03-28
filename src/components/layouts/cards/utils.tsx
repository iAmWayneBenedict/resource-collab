import { Eye, Lock, Users } from "lucide-react";

export const collectionItemIcons = {
	private: <Lock size={18} />,
	public: <Eye size={18} />,
	shared: <Users size={18} />,
};

export const formatNumber = (num: number): string => {
	if (num >= 1000) return (num / 1000).toFixed(1) + "k";
	return num.toString();
};
