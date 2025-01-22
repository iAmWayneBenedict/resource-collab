import { Suspense } from "react";
import VerificationLayout from "./_components";

const Verification = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerificationLayout />
		</Suspense>
	);
};

export default Verification;
