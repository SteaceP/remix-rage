import { getEnvFromContext } from "~/context";

export { getEnvFromContext };

export function getHubStub(context: unknown): DurableObjectStub | null {
    const env = getEnvFromContext(context);
    const namespace = env?.DIRECT_MESSAGE_HUB as DurableObjectNamespace | undefined;
    if (!namespace) {
        return null;
    }
    const id = namespace.idFromName("global");
    return namespace.get(id);
}

export async function fetchHubJson<T>(context: unknown, path: string, init?: RequestInit): Promise<T> {
    const stub = getHubStub(context);
    if (!stub) {
        throw new Error("DIRECT_MESSAGE_HUB Durable Object binding is not available");
    }
    const url = `https://do.internal${path.startsWith("/") ? path : `/${path}`}`;
    const response = await stub.fetch(new Request(url, init));
    const data = (await response.json()) as T & { error?: string };
    if (!response.ok) {
        throw new Error(data?.error || `Hub request failed (${response.status})`);
    }
    return data;
}
