import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useActionData } from "react-router";
import { ContactForm } from "~/components/ContactForm";
import { createCsrfToken, validateCsrfToken } from "~/utils/csrf.server";
import { sendEmail, emailSchema } from "~/utils/email.server";
import { contactStyles as styles } from "~/styles/components";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { token, cookieHeader } = await createCsrfToken(
    request,
    context.cloudflare.env.CSRF_SECRET
  );
  
  return Response.json(
    { csrfToken: token },
    {
      headers: {
        "Set-Cookie": cookieHeader
      }
    }
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const csrfToken = formData.get("csrfToken");

  if (typeof csrfToken !== "string") {
    return Response.json({ error: "Missing CSRF token" }, { status: 400 });
  }

  try {
    await validateCsrfToken(request, csrfToken, context.cloudflare.env.CSRF_SECRET);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    const data = {
      name,
      email,
      subject,
      message,
    };

    // Validate form data
    const validated = emailSchema.parse(data);

    // Get environment variables from context
    const brevoApiKey = (context.env as { BREVO_API_KEY?: string })?.BREVO_API_KEY;

    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    await sendEmail(validated, { BREVO_API_KEY: brevoApiKey });
    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export default function Contact() {
  const { csrfToken } = useLoaderData<typeof loader>() as { csrfToken: string };
  const actionData = useActionData<typeof action>() as { error?: string; success?: boolean };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.formInner}>
            <h1 className={styles.title}>
              Contact Me
            </h1>
            
            {actionData?.error && (
              <div className={styles.errorAlert}>
                <p className={styles.errorText}>{actionData.error}</p>
              </div>
            )}
            
            {actionData?.success && (
              <div className={styles.successAlert}>
                <p className={styles.successText}>Message sent successfully!</p>
              </div>
            )}
            
            <ContactForm csrfToken={csrfToken} />
          </div>
        </div>
      </div>
    </div>
  );
}
