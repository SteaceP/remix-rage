import { Form } from "react-router";
import { contactStyles as styles } from "~/styles/components";

interface ContactFormProps {
  csrfToken: string;
}

export function ContactForm({ csrfToken }: ContactFormProps) {
  return (
    <Form method="post" className={`${styles.form} font-['Inter']`}>
      <input type="hidden" name="csrfToken" value={csrfToken} />
      
      <div className={styles.formGroup}>
        <label htmlFor="name" className={`${styles.label} font-medium`}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={`${styles.input} font-normal`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={`${styles.label} font-medium`}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={`${styles.input} font-normal`}
        />
      </div>

      <div className={styles.formGroup}>
        <label 
          htmlFor="subject" 
          className={`${styles.label} font-medium`}
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className={`${styles.input} font-normal`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={`${styles.label} font-medium`}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className={`${styles.textarea} font-normal`}
        />
      </div>

      <div>
        <button
          type="submit"
          className={`${styles.button} font-medium`}
        >
          Send Message
        </button>
      </div>
    </Form>
  );
}
