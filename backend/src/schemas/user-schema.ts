import { z } from "zod";

const maxLengthErrorMessage = "Value must be less than 255 characters";
const minLengthErrorMessage = "Value must be at least 8 characters";
const emailErrorMessage = "Invalid email address";
const passwordErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
const ageErrorMessage = "Age must be between 18 and 100";
const nameErrorMessage = "Name must be between 3 and 255 characters";

const passwordSchema = z.string().min(8,{message: minLengthErrorMessage}).max(255,{message: maxLengthErrorMessage})
.refine(password => /[A-Z]/.test(password), { message: passwordErrorMessage })
.refine(password => /[a-z]/.test(password), { message: passwordErrorMessage })
.refine(password => /\d/.test(password), { message: passwordErrorMessage })
.refine(password => /[!@#$%^&*]/.test(password), { message: passwordErrorMessage });

const signupSchema = z.object({
    email: z.string().trim().toLowerCase().email({message: emailErrorMessage}),
    password: passwordSchema,
    age: z.coerce.number().int().min(18,{message: ageErrorMessage}).max(100,{message: ageErrorMessage}),
    name: z.string().min(3,{message: nameErrorMessage}).max(255,{message: nameErrorMessage}),
});

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email({message: emailErrorMessage}).nonempty({message: "email cannot be empty"}),
    password: z.string().nonempty({message: passwordErrorMessage}),
});

export { signupSchema, loginSchema };
