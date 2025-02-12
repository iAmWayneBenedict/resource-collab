import { Resend } from "resend";
import { EmailTemplate } from "../../emails";

const resend = new Resend(process.env.RESEND_API_KEY);

const resendService = {
	sendEmailVerification: async ({
		emails,
		otp,
	}: {
		emails: string[];
		otp: string;
	}) => {
		try {
			const { data, error } = await resend.emails.send({
				from: "RCollabs <onboarding@resend.dev>",
				to: emails,
				subject: "Verify your email address",
				react: EmailTemplate({ otp }),
			});

			if (error) {
				console.log(error);
				throw error;
			}

			return data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
};

export default resendService;
