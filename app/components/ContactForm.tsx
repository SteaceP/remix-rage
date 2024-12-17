import { useEffect, useRef } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { form } from "~/styles/components";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface ActionData {
    errors?: Partial<FormData>;
    success?: boolean;
}

interface ContactFormProps {
    csrfToken: string;
}

export function ContactForm({ csrfToken }: ContactFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    // Reset form on successful submission
    useEffect(() => {
        if (actionData?.success && formRef.current) {
            formRef.current.reset();
        }
    }, [actionData?.success]);

    return (
        <Form ref={formRef} method="post" className={form.form} noValidate>
            <input 
                type="hidden" 
                name="csrf-token" 
                value={csrfToken} 
            />
            <div className={form.formGroup}>
                <label htmlFor="name" className={form.label}>
                    Name
                </label>
                <input type="text" id="name" name="name" className={form.input} placeholder="Your name" />
                {actionData?.errors?.name && <p className={form.error}>{actionData.errors.name}</p>}
            </div>

            <div className={form.formGroup}>
                <label htmlFor="email" className={form.label}>
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className={form.input}
                    placeholder="your.email@example.com"
                />
                {actionData?.errors?.email && <p className={form.error}>{actionData.errors.email}</p>}
            </div>

            <div className={form.formGroup}>
                <label htmlFor="subject" className={form.label}>
                    Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={form.input}
                    placeholder="What's this about?"
                />
                {actionData?.errors?.subject && <p className={form.error}>{actionData.errors.subject}</p>}
            </div>

            <div className={form.formGroup}>
                <label htmlFor="message" className={form.label}>
                    Message
                </label>
                <textarea id="message" name="message" className={form.textarea} placeholder="Your message here..." />
                {actionData?.errors?.message && <p className={form.error}>{actionData.errors.message}</p>}
            </div>

            <button type="submit" className={form.button} disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <FaPaperPlane />
                        Send Message
                    </>
                )}
            </button>

            {actionData?.success && <p className={form.success}>Thank you! Your message has been sent successfully.</p>}
        </Form>
    );
}
