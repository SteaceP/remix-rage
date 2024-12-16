import { useEffect, useRef } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

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

const styles = {
  form: "w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8",
  formGroup: "mb-6 text-left",
  label: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
  input: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
  textarea: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[150px] resize-y",
  error: "text-sm text-red-500 dark:text-red-400 mt-1",
  button: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
  success: "text-green-600 dark:text-green-400 text-center mt-4",
};

export function ContactForm() {
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
    <Form
      ref={formRef}
      method="post"
      className={styles.form}
      noValidate
    >
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className={styles.input}
          placeholder="Your name"
        />
        {actionData?.errors?.name && (
          <p className={styles.error}>{actionData.errors.name}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className={styles.input}
          placeholder="your.email@example.com"
        />
        {actionData?.errors?.email && (
          <p className={styles.error}>{actionData.errors.email}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          className={styles.input}
          placeholder="What's this about?"
        />
        {actionData?.errors?.subject && (
          <p className={styles.error}>{actionData.errors.subject}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          placeholder="Your message here..."
        />
        {actionData?.errors?.message && (
          <p className={styles.error}>{actionData.errors.message}</p>
        )}
      </div>

      <button 
        type="submit" 
        className={styles.button}
        disabled={isSubmitting}
      >
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

      {actionData?.success && (
        <p className={styles.success}>
          Thank you! Your message has been sent successfully.
        </p>
      )}
    </Form>
  );
} 