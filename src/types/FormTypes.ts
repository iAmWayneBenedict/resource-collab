import { z } from "zod";

// extend the InputHTMLAttributes and TextareaHTMLAttributes to include the custom props

export type InputType = React.InputHTMLAttributes<HTMLInputElement>;

export type TextAreaType = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// Define the valid names for every form input
export const validContactFormNames = z.enum(["name", "email", "link", "message"]);
export const validLoginFormNames = z.enum(["email", "password"]);
export const validRegisterFormNames = z.enum(["name", "email", "password", "confirm_password"]);

// Combine the valid names for every form input
const allValidFormNames = z.union([
	validContactFormNames,
	validLoginFormNames,
	validRegisterFormNames,
]);

// Infer the type from the schema
export type TValidFormNames = z.infer<typeof allValidFormNames>;
