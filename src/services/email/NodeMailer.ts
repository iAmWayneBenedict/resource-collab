import { EmailTemplate } from "@/emails";
import { render } from "@react-email/components";

const nodemailer = require("nodemailer");

type Params = {
	emails: string[];
	otp: string;
};

const nodeMailerService = {
	/**
	 * Send an email verification code to the given email addresses
	 * @param {Object} params
	 * @param {string[]} params.emails - Email addresses to send verification to
	 * @param {string} params.otp - The verification OTP
	 * @returns {Promise<void>}
	 * @throws {Error} If sending the email fails
	 */
	sendEmailVerification: async ({ emails, otp }: Params): Promise<void> => {
		const transport = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
		const result = await transport.sendMail({
			to: emails,
			from: `RCollabs ${process.env.SMTP_USER}`,
			subject: `Verify your email address`,
			text: "Verify your email address",
			html: await render(EmailTemplate({ otp })),
		});
		const failed = result.rejected.concat(result.pending).filter(Boolean);
		if (failed.length) {
			throw new Error(
				`Email(s) (${failed.join(", ")}) could not be sent`,
			);
		}
	},
};

export default nodeMailerService;
