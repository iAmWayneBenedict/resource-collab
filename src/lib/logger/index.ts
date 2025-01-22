import { NextRequest } from "next/server";
import winston from "winston";

const logger = (req: NextRequest) => {
	return winston.createLogger({
		level: "info",
		format: winston.format.combine(
			winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			winston.format.json()
		),
		transports: [
			new winston.transports.Console(),
			new winston.transports.File({ filename: "logs/api.log" }),
		],
	});
};

export default logger;
