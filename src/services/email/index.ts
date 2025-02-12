import nodeMailerService from "./NodeMailer";
import resendService from "./Resend";

export const EmailService = {
	resend: { ...resendService },
	nodeMailer: { ...nodeMailerService },
};
