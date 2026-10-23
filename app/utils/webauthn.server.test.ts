import { describe, expect, it } from "vitest";
import { fromBase64Url, toBase64Url } from "./auth.server";
import {
    derToP1363,
    generateWebAuthnChallenge,
    p256RawPointToSpki,
    verifyPasskeyAssertion,
    verifyPasskeyRegistration,
} from "./webauthn.server";
import type { PasskeyCredential } from "./dm-types";

describe("webauthn.server", () => {
    describe("generateWebAuthnChallenge", () => {
        it("returns a 32-byte base64url challenge", () => {
            const challenge = generateWebAuthnChallenge();
            const bytes = fromBase64Url(challenge);
            expect(bytes.length).toBe(32);
        });

        it("generates different challenges on repeated calls", () => {
            const c1 = generateWebAuthnChallenge();
            const c2 = generateWebAuthnChallenge();
            expect(c1).not.toBe(c2);
        });
    });

    describe("derToP1363", () => {
        it("returns the buffer untouched if already 64 bytes and does not start with 0x30", () => {
            const raw = new Uint8Array(64).fill(0xaa);
            const result = derToP1363(raw);
            expect(result).toBe(raw);
        });

        it("throws if DER length is less than 8", () => {
            expect(() => derToP1363(new Uint8Array([0x30, 0x04]))).toThrow("Invalid DER signature header");
        });

        it("throws if DER does not start with 0x30", () => {
            expect(() => derToP1363(new Uint8Array(10).fill(0x00))).toThrow("Invalid DER signature header");
        });

        it("throws if R marker is not 0x02", () => {
            // [0x30, len, 0x03, ...]
            const badDer = new Uint8Array([0x30, 0x08, 0x03, 0x01, 0x00, 0x02, 0x01, 0x00]);
            expect(() => derToP1363(badDer)).toThrow("Invalid DER R marker");
        });

        it("throws if R length is invalid or out of range", () => {
            const badLen = new Uint8Array([0x30, 0x08, 0x02, 0x00, 0x02, 0x01, 0x00, 0x00]);
            expect(() => derToP1363(badLen)).toThrow("Invalid DER R coordinate length");

            const overflowLen = new Uint8Array([
                0x30, 0x0a, 0x02, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ]);
            expect(() => derToP1363(overflowLen)).toThrow("Invalid DER R coordinate length");
        });

        it("throws if S marker is not 0x02", () => {
            const badDer = new Uint8Array([0x30, 0x08, 0x02, 0x01, 0x01, 0x03, 0x01, 0x01]);
            expect(() => derToP1363(badDer)).toThrow("Invalid DER S marker");
        });

        it("throws if S length is invalid or out of range", () => {
            const badDer = new Uint8Array([0x30, 0x08, 0x02, 0x01, 0x01, 0x02, 0x00, 0x00]);
            expect(() => derToP1363(badDer)).toThrow("Invalid DER S coordinate length");

            const overflowS = new Uint8Array([0x30, 0x09, 0x02, 0x01, 0x01, 0x02, 0x20, 0x00, 0x00]);
            expect(() => derToP1363(overflowS)).toThrow("Invalid DER S coordinate length");
        });

        it("throws if coordinates exceed 32 bytes without valid leading zeros", () => {
            // 33 bytes coordinate where first byte is not 0x00
            const der = new Uint8Array(2 + 2 + 33 + 2 + 32);
            der[0] = 0x30;
            der[1] = 69;
            der[2] = 0x02;
            der[3] = 33;
            der[4] = 0x01; // Not 0x00
            der.fill(0x11, 5, 37);
            der[37] = 0x02;
            der[38] = 32;
            der.fill(0x22, 39, 71);
            expect(() => derToP1363(der)).toThrow("Coordinate exceeds P-256 byte length");
        });

        it("parses DER with multi-byte length offset (der[1] & 0x80)", () => {
            const r = new Uint8Array(32).fill(0x11);
            const s = new Uint8Array(32).fill(0x22);
            // 0x30, 0x81, 68, 0x02, 32, ...r, 0x02, 32, ...s
            const der = new Uint8Array(3 + 2 + 32 + 2 + 32);
            der[0] = 0x30;
            der[1] = 0x81;
            der[2] = 68;
            der[3] = 0x02;
            der[4] = 32;
            der.set(r, 5);
            der[37] = 0x02;
            der[38] = 32;
            der.set(s, 39);

            const p1363 = derToP1363(der);
            expect(p1363.length).toBe(64);
            expect(Array.from(p1363.slice(0, 32))).toEqual(Array.from(r));
            expect(Array.from(p1363.slice(32, 64))).toEqual(Array.from(s));
        });

        it("strips leading zeros on S coordinate if 33 bytes", () => {
            const r = new Uint8Array(32).fill(0x11);
            const s = new Uint8Array(32).fill(0x22);
            // Construct DER with leading 0x00 on S (33 bytes)
            const der = new Uint8Array(2 + 2 + 32 + 2 + 33);
            der[0] = 0x30;
            der[1] = 69;
            der[2] = 0x02;
            der[3] = 32;
            der.set(r, 4);
            der[36] = 0x02;
            der[37] = 33;
            der[38] = 0x00;
            der.set(s, 39);

            const p1363 = derToP1363(der);
            expect(p1363.length).toBe(64);
            expect(Array.from(p1363.slice(0, 32))).toEqual(Array.from(r));
            expect(Array.from(p1363.slice(32, 64))).toEqual(Array.from(s));
        });

        it("pads coordinates that are shorter than 32 bytes", () => {
            const r = new Uint8Array([0x12, 0x34]); // 2 bytes
            const s = new Uint8Array([0x56, 0x78]); // 2 bytes
            const der = new Uint8Array(2 + 2 + r.length + 2 + s.length);
            der[0] = 0x30;
            der[1] = der.length - 2;
            der[2] = 0x02;
            der[3] = r.length;
            der.set(r, 4);
            der[4 + r.length] = 0x02;
            der[5 + r.length] = s.length;
            der.set(s, 6 + r.length);

            const p1363 = derToP1363(der);
            expect(p1363.length).toBe(64);
            expect(p1363[30]).toBe(0x12);
            expect(p1363[31]).toBe(0x34);
            expect(p1363[62]).toBe(0x56);
            expect(p1363[63]).toBe(0x78);
        });
    });

    describe("p256RawPointToSpki", () => {
        it("prepends the standard 26-byte SPKI prefix to a 65-byte uncompressed point", async () => {
            const keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
                "sign",
                "verify",
            ]);
            const rawPub = new Uint8Array((await crypto.subtle.exportKey("raw", keyPair.publicKey)) as ArrayBuffer);
            expect(rawPub.length).toBe(65);

            const spkiBytes = p256RawPointToSpki(rawPub);
            expect(spkiBytes.length).toBe(91);

            // Verify Web Crypto can import it as SPKI
            const importedKey = await crypto.subtle.importKey(
                "spki",
                spkiBytes.buffer as ArrayBuffer,
                { name: "ECDSA", namedCurve: "P-256" },
                true,
                ["verify"]
            );
            expect(importedKey).toBeDefined();
        });
    });

    describe("verifyPasskeyRegistration", () => {
        async function createMockRegistrationData(rpId: string, origin: string, challenge: string) {
            const keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
                "sign",
                "verify",
            ]);
            const spkiBytes = new Uint8Array((await crypto.subtle.exportKey("spki", keyPair.publicKey)) as ArrayBuffer);

            const clientDataObj = {
                type: "webauthn.create",
                challenge,
                origin,
            };
            const clientDataJSON = toBase64Url(new TextEncoder().encode(JSON.stringify(clientDataObj)));

            // AuthenticatorData: 32 bytes rpIdHash + 1 byte flags (user presence = 0x01) + 4 bytes signCount
            const rpIdHash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rpId)));
            const authData = new Uint8Array(37);
            authData.set(rpIdHash, 0);
            authData[32] = 0x01; // User Present
            const view = new DataView(authData.buffer, authData.byteOffset + 33, 4);
            view.setUint32(0, 10, false); // initial counter = 10

            return {
                credentialId: "cred_test_123",
                publicKeySpki: toBase64Url(spkiBytes),
                clientDataJSON,
                authenticatorData: toBase64Url(authData),
                expectedChallenge: challenge,
                expectedOrigin: origin,
                expectedRpId: rpId,
                deviceName: "My Test Phone",
            };
        }

        it("successfully verifies valid registration with ECDSA key", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            const cred = await verifyPasskeyRegistration(data);

            expect(cred.id).toBe("cred_test_123");
            expect(cred.publicKeySpki).toBe(data.publicKeySpki);
            expect(cred.algorithm).toBe(-7);
            expect(cred.counter).toBe(10);
            expect(cred.deviceName).toBe("My Test Phone");
            expect(cred.createdAt).toBeGreaterThan(0);
        });

        it("defaults deviceName to Mobile Passkey if empty or whitespace", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            data.deviceName = "   ";
            const cred = await verifyPasskeyRegistration(data);
            expect(cred.deviceName).toBe("Mobile Passkey");
        });

        it("supports RSA-256 (alg -257) registration", async () => {
            const rsaKeyPair = await crypto.subtle.generateKey(
                {
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["sign", "verify"]
            );
            const rsaSpki = new Uint8Array(
                (await crypto.subtle.exportKey("spki", rsaKeyPair.publicKey)) as ArrayBuffer
            );
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");

            const cred = await verifyPasskeyRegistration({
                ...data,
                publicKeySpki: toBase64Url(rsaSpki),
                algorithm: -257,
            });
            expect(cred.algorithm).toBe(-257);
        });

        it("throws if type is not webauthn.create", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            const badClientData = toBase64Url(
                new TextEncoder().encode(
                    JSON.stringify({
                        type: "webauthn.get",
                        challenge: "test_challenge",
                        origin: "https://localhost:3000",
                    })
                )
            );
            await expect(verifyPasskeyRegistration({ ...data, clientDataJSON: badClientData })).rejects.toThrow(
                "Invalid WebAuthn registration type"
            );
        });

        it("throws if challenge does not match", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            await expect(
                verifyPasskeyRegistration({ ...data, expectedChallenge: "different_challenge" })
            ).rejects.toThrow("Registration challenge mismatch");
        });

        it("throws if origin does not match", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            await expect(
                verifyPasskeyRegistration({ ...data, expectedOrigin: "https://attacker.com" })
            ).rejects.toThrow("Registration origin mismatch");
        });

        it("throws if authenticatorData is missing", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            await expect(verifyPasskeyRegistration({ ...data, authenticatorData: "" })).rejects.toThrow(
                "authenticatorData is required for registration verification"
            );
        });

        it("throws if authenticatorData is shorter than 37 bytes", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            const shortAuthData = toBase64Url(new Uint8Array(36));
            await expect(verifyPasskeyRegistration({ ...data, authenticatorData: shortAuthData })).rejects.toThrow(
                "Invalid authenticatorData length"
            );
        });

        it("throws if RP ID hash does not match", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            await expect(verifyPasskeyRegistration({ ...data, expectedRpId: "different-rp.com" })).rejects.toThrow(
                "RP ID hash mismatch during registration"
            );
        });

        it("throws if user presence flag is not set", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            const rawAuthData = fromBase64Url(data.authenticatorData!);
            rawAuthData[32] = 0x00; // clear user presence flag
            await expect(
                verifyPasskeyRegistration({ ...data, authenticatorData: toBase64Url(rawAuthData) })
            ).rejects.toThrow("User presence flag not set");
        });

        it("throws for unsupported public key algorithm", async () => {
            const data = await createMockRegistrationData("localhost", "https://localhost:3000", "test_challenge");
            await expect(verifyPasskeyRegistration({ ...data, algorithm: -8 })).rejects.toThrow(
                "Unsupported public key algorithm: -8"
            );
        });
    });

    function rawEcdsaToDer(rawSig: Uint8Array): Uint8Array {
        const r = rawSig.slice(0, 32);
        const s = rawSig.slice(32, 64);
        const rNeedsPad = (r[0] & 0x80) !== 0;
        const sNeedsPad = (s[0] & 0x80) !== 0;
        const rLen = 32 + (rNeedsPad ? 1 : 0);
        const sLen = 32 + (sNeedsPad ? 1 : 0);
        const derSig = new Uint8Array(2 + 2 + rLen + 2 + sLen);
        derSig[0] = 0x30;
        derSig[1] = 2 + rLen + 2 + sLen;
        derSig[2] = 0x02;
        derSig[3] = rLen;
        if (rNeedsPad) {
            derSig[4] = 0x00;
            derSig.set(r, 5);
        } else {
            derSig.set(r, 4);
        }
        const sOffset = 4 + rLen;
        derSig[sOffset] = 0x02;
        derSig[sOffset + 1] = sLen;
        if (sNeedsPad) {
            derSig[sOffset + 2] = 0x00;
            derSig.set(s, sOffset + 3);
        } else {
            derSig.set(s, sOffset + 2);
        }
        return derSig;
    }

    describe("verifyPasskeyAssertion", () => {
        async function createMockAssertionSetup() {
            const keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
                "sign",
                "verify",
            ]);
            const spkiBytes = new Uint8Array((await crypto.subtle.exportKey("spki", keyPair.publicKey)) as ArrayBuffer);

            const rpId = "coderage.pro";
            const origin = "https://coderage.pro";
            const challenge = generateWebAuthnChallenge();

            const clientDataObj = {
                type: "webauthn.get",
                challenge,
                origin,
            };
            const clientDataBytes = new TextEncoder().encode(JSON.stringify(clientDataObj));
            const clientDataJSON = toBase64Url(clientDataBytes);

            const rpIdHash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rpId)));
            const authData = new Uint8Array(37);
            authData.set(rpIdHash, 0);
            authData[32] = 0x01; // User Present
            const view = new DataView(authData.buffer, authData.byteOffset + 33, 4);
            view.setUint32(0, 15, false); // sign count = 15

            // Signature over (authData || SHA-256(clientDataJSON))
            const clientDataHash = new Uint8Array(
                await crypto.subtle.digest("SHA-256", clientDataBytes.buffer as ArrayBuffer)
            );
            const signedData = new Uint8Array(authData.length + clientDataHash.length);
            signedData.set(authData, 0);
            signedData.set(clientDataHash, authData.length);

            const rawSig = new Uint8Array(
                await crypto.subtle.sign(
                    { name: "ECDSA", hash: "SHA-256" },
                    keyPair.privateKey,
                    signedData.buffer as ArrayBuffer
                )
            );

            const derSig = rawEcdsaToDer(rawSig);

            const credential: PasskeyCredential = {
                id: "cred_test_1",
                publicKeySpki: toBase64Url(spkiBytes),
                algorithm: -7,
                counter: 10,
                deviceName: "Admin Mac",
                createdAt: Date.now() - 10000,
            };

            return {
                credentialId: credential.id,
                clientDataJSON,
                authenticatorData: toBase64Url(authData),
                signature: toBase64Url(derSig),
                expectedChallenge: challenge,
                expectedOrigin: origin,
                expectedRpId: rpId,
                credential,
                keyPair,
                authData,
                clientDataHash,
            };
        }

        it("verifies a valid assertion and returns updated counter", async () => {
            const setup = await createMockAssertionSetup();
            const result = await verifyPasskeyAssertion({
                credentialId: setup.credentialId,
                clientDataJSON: setup.clientDataJSON,
                authenticatorData: setup.authenticatorData,
                signature: setup.signature,
                expectedChallenge: setup.expectedChallenge,
                expectedOrigin: setup.expectedOrigin,
                expectedRpId: setup.expectedRpId,
                credential: setup.credential,
            });

            expect(result.newCounter).toBe(15);
        });

        it("increments counter when authenticator signCount is 0", async () => {
            const setup = await createMockAssertionSetup();
            // Set counter to 0 in authData
            const authData = fromBase64Url(setup.authenticatorData);
            new DataView(authData.buffer, authData.byteOffset + 33, 4).setUint32(0, 0, false);

            // Re-sign
            const signedData = new Uint8Array(authData.length + setup.clientDataHash.length);
            signedData.set(authData, 0);
            signedData.set(setup.clientDataHash, authData.length);
            const sig = new Uint8Array(
                await crypto.subtle.sign(
                    { name: "ECDSA", hash: "SHA-256" },
                    setup.keyPair.privateKey,
                    signedData.buffer as ArrayBuffer
                )
            );

            const result = await verifyPasskeyAssertion({
                credentialId: setup.credentialId,
                clientDataJSON: setup.clientDataJSON,
                authenticatorData: toBase64Url(authData),
                signature: toBase64Url(rawEcdsaToDer(sig)),
                expectedChallenge: setup.expectedChallenge,
                expectedOrigin: setup.expectedOrigin,
                expectedRpId: setup.expectedRpId,
                credential: setup.credential, // counter is 10
            });

            expect(result.newCounter).toBe(11);
        });

        it("detects replay attack when counter does not advance", async () => {
            const setup = await createMockAssertionSetup();
            // Replay with counter 10 when credential counter is 10
            const authData = fromBase64Url(setup.authenticatorData);
            new DataView(authData.buffer, authData.byteOffset + 33, 4).setUint32(0, 10, false);

            await expect(
                verifyPasskeyAssertion({
                    credentialId: setup.credentialId,
                    clientDataJSON: setup.clientDataJSON,
                    authenticatorData: toBase64Url(authData),
                    signature: setup.signature,
                    expectedChallenge: setup.expectedChallenge,
                    expectedOrigin: setup.expectedOrigin,
                    expectedRpId: setup.expectedRpId,
                    credential: setup.credential,
                })
            ).rejects.toThrow("Passkey signature counter replay detected");
        });

        it("throws if type is not webauthn.get", async () => {
            const setup = await createMockAssertionSetup();
            const clientData = toBase64Url(
                new TextEncoder().encode(
                    JSON.stringify({
                        type: "webauthn.create",
                        challenge: setup.expectedChallenge,
                        origin: setup.expectedOrigin,
                    })
                )
            );
            await expect(verifyPasskeyAssertion({ ...setup, clientDataJSON: clientData })).rejects.toThrow(
                "Invalid WebAuthn assertion type"
            );
        });

        it("throws on challenge mismatch", async () => {
            const setup = await createMockAssertionSetup();
            await expect(
                verifyPasskeyAssertion({ ...setup, expectedChallenge: "different-challenge" })
            ).rejects.toThrow("Assertion challenge mismatch");
        });

        it("throws on origin mismatch", async () => {
            const setup = await createMockAssertionSetup();
            await expect(verifyPasskeyAssertion({ ...setup, expectedOrigin: "https://phishing.com" })).rejects.toThrow(
                "Assertion origin mismatch"
            );
        });

        it("throws if authenticatorData is too short", async () => {
            const setup = await createMockAssertionSetup();
            await expect(
                verifyPasskeyAssertion({ ...setup, authenticatorData: toBase64Url(new Uint8Array(30)) })
            ).rejects.toThrow("Invalid authenticatorData length");
        });

        it("throws on RP ID hash mismatch", async () => {
            const setup = await createMockAssertionSetup();
            await expect(verifyPasskeyAssertion({ ...setup, expectedRpId: "evil.com" })).rejects.toThrow(
                "RP ID hash mismatch"
            );
        });

        it("throws if user presence is not set", async () => {
            const setup = await createMockAssertionSetup();
            const authData = fromBase64Url(setup.authenticatorData);
            authData[32] = 0x00; // Clear user presence
            await expect(
                verifyPasskeyAssertion({ ...setup, authenticatorData: toBase64Url(authData) })
            ).rejects.toThrow("User presence required");
        });

        it("throws when signature verification fails", async () => {
            const setup = await createMockAssertionSetup();
            const badSig = new Uint8Array(64).fill(0x33);
            await expect(verifyPasskeyAssertion({ ...setup, signature: toBase64Url(badSig) })).rejects.toThrow(
                "Passkey signature verification failed"
            );
        });

        it("verifies valid assertion using RSA-256 (alg -257)", async () => {
            const rsaKeyPair = await crypto.subtle.generateKey(
                {
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["sign", "verify"]
            );
            const rsaSpki = new Uint8Array(
                (await crypto.subtle.exportKey("spki", rsaKeyPair.publicKey)) as ArrayBuffer
            );

            const rpId = "coderage.pro";
            const origin = "https://coderage.pro";
            const challenge = generateWebAuthnChallenge();

            const clientDataObj = {
                type: "webauthn.get",
                challenge,
                origin,
            };
            const clientDataBytes = new TextEncoder().encode(JSON.stringify(clientDataObj));
            const clientDataJSON = toBase64Url(clientDataBytes);

            const rpIdHash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rpId)));
            const authData = new Uint8Array(37);
            authData.set(rpIdHash, 0);
            authData[32] = 0x01; // User Present
            const view = new DataView(authData.buffer, authData.byteOffset + 33, 4);
            view.setUint32(0, 20, false); // sign count = 20

            const clientDataHash = new Uint8Array(
                await crypto.subtle.digest("SHA-256", clientDataBytes.buffer as ArrayBuffer)
            );
            const signedData = new Uint8Array(authData.length + clientDataHash.length);
            signedData.set(authData, 0);
            signedData.set(clientDataHash, authData.length);

            const rsaSig = new Uint8Array(
                await crypto.subtle.sign(
                    { name: "RSASSA-PKCS1-v1_5" },
                    rsaKeyPair.privateKey,
                    signedData.buffer as ArrayBuffer
                )
            );

            const credential: PasskeyCredential = {
                id: "cred_rsa_1",
                publicKeySpki: toBase64Url(rsaSpki),
                algorithm: -257,
                counter: 5,
                deviceName: "Admin Key",
                createdAt: Date.now() - 5000,
            };

            const result = await verifyPasskeyAssertion({
                credentialId: credential.id,
                clientDataJSON,
                authenticatorData: toBase64Url(authData),
                signature: toBase64Url(rsaSig),
                expectedChallenge: challenge,
                expectedOrigin: origin,
                expectedRpId: rpId,
                credential,
            });

            expect(result.newCounter).toBe(20);
        });
    });
});
