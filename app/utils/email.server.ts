import { z } from "zod";
import type { LoaderFunctionArgs } from "react-router";

const emailSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name too long")
        .regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters"),
    email: z.email("Invalid email address").max(254, "Email too long"), // RFC 5321 max length
    subject: z.string().min(1, "Subject is required").max(200, "Subject too long").trim(),
    message: z.string().min(10, "Message must be at least 10 characters long").max(5000, "Message too long").trim(),
});

type EmailData = z.infer<typeof emailSchema>;

interface BrevoEmailResponse {
    messageId?: string;
    code?: string;
    message?: string;
}

// HTML sanitization helper
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function sendEmail(data: EmailData, { context }: LoaderFunctionArgs) {
    // Validate the data
    const validated = emailSchema.parse(data);

    const apiUrl = "https://api.brevo.com/v3/smtp/email";

    // Sanitize user input to prevent XSS in email
    const safeName = escapeHtml(validated.name);
    const safeEmail = escapeHtml(validated.email);
    const safeSubject = escapeHtml(validated.subject);
    const safeMessage = escapeHtml(validated.message).replace(/\n/g, "<br>");

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                accept: "application/json",
                "api-key": context.cloudflare?.env?.BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: "Code Rage",
                    email: "contact@coderage.pro",
                },
                to: [
                    {
                        email: "steace@coderage.pro",
                        name: "Code Rage Support",
                    },
                ],
                replyTo: {
                    email: validated.email,
                    name: validated.name,
                },
                subject: `Contact Form: ${validated.subject}`,
                htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h3 style="color: #2563eb;">New Contact Form Submission</h3>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
              <p><strong>Subject:</strong> ${safeSubject}</p>
            </div>
            <div style="background: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${safeMessage}</p>
            </div>
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
              Sent from coderage.pro contact form at ${new Date().toISOString()}
            </p>
          </body>
          </html>
        `,
            }),
        });

        const result: BrevoEmailResponse = await response.json();

        if (!response.ok) {
            // Don't expose internal error messages to client
            console.error("Brevo API error:", result);
            throw new Error("Failed to send email");
        }

        return { success: true, messageId: result.messageId };
    } catch (error) {
        // Log detailed error server-side but don't expose to client
        console.error("Email sending error:", error);
        throw new Error("Failed to send email. Please try again later.");
    }
}

export { emailSchema };
