import type { MetaFunction, ActionFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { ContactForm } from "~/components/ContactForm";
import { sendContactEmail } from "~/utils/email.server";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const data = {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        subject: formData.get("subject")?.toString() || "",
        message: formData.get("message")?.toString() || "",
    };

    const errors: Partial<FormData> = {};

    if (!data.name) errors.name = "Name is required";
    if (!data.email) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Please enter a valid email address";
    }
    if (!data.subject) errors.subject = "Subject is required";
    if (!data.message) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
        return Response.json({ errors }, { status: 400 });
    }

    try {
        await sendContactEmail(data);
        return Response.json({ success: true });
    } catch (error) {
        console.error("Failed to send message:", error);
        return Response.json({ errors: { message: "Failed to send message. Please try again." } }, { status: 500 });
    }
};

export const meta: MetaFunction = () => {
    return [
        { title: "Contact - Code Rage" },
        {
            name: "description",
            content:
                "Get in touch with Code Rage for your tech needs. Professional computer repair and web development services.",
        },
    ];
};

const styles = {
    container: "flex-grow flex flex-col w-full py-16 px-4",
    content: "w-full max-w-4xl mx-auto",
    headerSection: "text-center mb-12",
    title: "text-4xl font-bold text-gray-900 dark:text-white mb-4",
    subtitle: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto",
};

export default function Contact() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.headerSection}>
                    <h1 className={styles.title}>Get in Touch</h1>
                    <p className={styles.subtitle}>
                        Have a question or ready to start a project? I&apos;m here to help! Fill out the form below and
                        I&apos;ll get back to you as soon as possible.
                    </p>
                </div>
                <ContactForm />
            </div>
        </div>
    );
}
