export const redactSensitiveData = (obj: any) => {
	const sensitiveFields = ["password", "token", "authorization"];
	const redacted = { ...obj };

	sensitiveFields.forEach((field) => {
		if (redacted[field]) {
			redacted[field] = "******";
		}
	});

	return redacted;
};
