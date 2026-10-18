import { z } from "zod";

export interface ChatMessage {
    id: string;
    threadId: string;
    sender: "visitor" | "admin";
    senderName: string;
    text: string;
    createdAt: number;
    readAt?: number;
}

export interface ChatThread {
    id: string;
    visitorName: string;
    visitorContact?: string;
    topic: string;
    createdAt: number;
    updatedAt: number;
    unreadByAdmin: number;
    unreadByVisitor: number;
    status: "open" | "archived";
    lastMessagePreview: string;
    visitorOnline?: boolean;
}

export interface AdminPresence {
    available: boolean;
    adminConnected: boolean;
    statusText: string;
    updatedAt: number;
}

export interface PasskeyCredential {
    id: string;
    publicKeySpki: string;
    algorithm: number;
    counter: number;
    deviceName: string;
    createdAt: number;
    lastUsedAt?: number;
}

export interface PushSubscriptionRecord {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
        p256dh: string;
        auth: string;
    };
    deviceLabel?: string;
    createdAt: number;
}

export type WsServerEvent =
    | {
          type: "visitor_init";
          presence: AdminPresence;
          thread: ChatThread | null;
          messages: ChatMessage[];
      }
    | {
          type: "admin_init";
          presence: AdminPresence;
          threads: ChatThread[];
          vapidPublicKey: string;
          passkeys: Array<Omit<PasskeyCredential, "publicKeySpki">>;
          pushCount: number;
      }
    | {
          type: "presence";
          presence: AdminPresence;
      }
    | {
          type: "message";
          thread: ChatThread;
          message: ChatMessage;
      }
    | {
          type: "thread_messages";
          thread: ChatThread;
          messages: ChatMessage[];
      }
    | {
          type: "thread_updated";
          thread: ChatThread;
      }
    | {
          type: "thread_deleted";
          threadId: string;
      }
    | {
          type: "typing";
          threadId: string;
          sender: "visitor" | "admin";
          isTyping: boolean;
      }
    | {
          type: "read";
          threadId: string;
          reader: "visitor" | "admin";
          readAt: number;
      }
    | {
          type: "pong";
          ts: number;
      }
    | {
          type: "error";
          error: string;
      };

export const visitorStartSchema = z.object({
    threadId: z.string().min(8).max(80).optional(),
    visitorToken: z.string().min(16).max(128).optional(),
    visitorName: z.string().trim().min(1, "Please enter your name").max(80, "Name must be 80 characters or fewer"),
    visitorContact: z
        .string()
        .trim()
        .max(160, "Contact info must be 160 characters or fewer")
        .optional()
        .or(z.literal("")),
    topic: z.string().trim().min(1, "Please select or enter a topic").max(120, "Topic must be 120 characters or fewer"),
    text: z.string().trim().min(1, "Message cannot be empty").max(4000, "Message must be 4000 characters or fewer"),
});

export const chatMessageSchema = z.object({
    threadId: z.string().min(8).max(80),
    text: z.string().trim().min(1, "Message cannot be empty").max(4000, "Message must be 4000 characters or fewer"),
});
