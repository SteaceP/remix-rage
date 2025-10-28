import { z } from "zod";

const emailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type EmailData = z.infer<typeof emailSchema>;

interface BrevoEmailResponse {
  messageId?: string;
  code?: string;
  message?: string;
}

export async function sendEmail(data: EmailData, env: { BREVO_API_KEY: string }) {
  // Validate the data
  const validated = emailSchema.parse(data);

  const apiUrl = 'https://api.brevo.com/v3/smtp/email';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: "Code Rage",
          email: "contact@coderage.pro"
        },
        to: [{
          email: "steace@coderage.pro",
          name: "Code Rage Support"
        }],
        replyTo: {
          email: validated.email,
          name: validated.name
        },
        subject: `Contact Form: ${validated.subject}`,
        htmlContent: `
          <h3>New Contact Form Submission</h3>
          <p><strong>From:</strong> ${validated.name} (${validated.email})</p>
          <p><strong>Subject:</strong> ${validated.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${validated.message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    const result: BrevoEmailResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send email');
  }
}

export { emailSchema };
