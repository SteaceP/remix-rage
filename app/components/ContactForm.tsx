import { Form, useNavigation, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { contactStyles as styles } from "~/styles/components";

interface ContactFormProps {
    csrfToken: string;
}

const QUICK_TOPICS = [
    "Website Development",
    "Cross-Platform App",
    "Computer Repair",
    "Family Tech Support",
    "General Inquiry",
];

export function ContactForm({ csrfToken }: ContactFormProps) {
    const [searchParams] = useSearchParams();
    const serviceParam = searchParams.get("service") || "";
    const [subject, setSubject] = useState(serviceParam);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    useEffect(() => {
        if (serviceParam) {
            setSubject(serviceParam);
        }
    }, [serviceParam]);

    return (
        <Form method="post" className={styles.form}>
            <input type="hidden" name="csrfToken" value={csrfToken} />

            {/* Quick Topic Selector */}
            <div className="space-y-2">
                <span className={styles.label}>Quick Topic Select</span>
                <div className="flex flex-wrap gap-2">
                    {QUICK_TOPICS.map((topic) => {
                        const isSelected = subject.toLowerCase() === topic.toLowerCase();
                        return (
                            <button
                                key={topic}
                                type="button"
                                onClick={() => setSubject(topic)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                                    isSelected
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                            >
                                {topic}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                    Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can I help you?"
                    className={styles.input}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell me a bit about your project, device issue, or support needs..."
                    className={styles.textarea}
                />
            </div>

            <div className="pt-1">
                <button type="submit" disabled={isSubmitting} className={styles.button}>
                    <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                    <FaPaperPlane className="w-3.5 h-3.5" />
                </button>
            </div>
        </Form>
    );
}

