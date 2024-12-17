import { z } from "zod";

// Create a schema for email validation
export const emailSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
});

// Add a type for the validated data
export type ValidatedEmailData = z.infer<typeof emailSchema>;

export async function sendContactEmail(data: ValidatedEmailData) {
    try {
        const response = await fetch("https://form.coderage.pro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = (await response.json()) as { details?: string };

        if (!response.ok) {
            throw new Error(responseData.details || "Failed to send email");
        }

        return { success: true };
    } catch (error) {
        throw new Error(
            error instanceof Error 
                ? error.message 
                : "Failed to send email. Please try again later."
        );
    }
}
