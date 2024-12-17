import { z } from "zod";

// Create a schema for email validation
const emailSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
});

type EmailActionData = {
    success?: boolean;
    errors?: {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
        _form?: string;
    };
};

export async function emailAction({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        // Validate the input data
        const result = emailSchema.safeParse(data);
        
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return new Response(
                JSON.stringify({ errors: errors as EmailActionData["errors"] }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const response = await fetch("https://form.coderage.pro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result.data),
        });

        const responseData = (await response.json()) as { details?: string };

        if (!response.ok) {
            return new Response(
                JSON.stringify({ 
                    errors: { 
                        _form: responseData.details || "Failed to send email" 
                    } 
                }),
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ 
                errors: { 
                    _form: "Failed to send email. Please try again later." 
                } 
            }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
