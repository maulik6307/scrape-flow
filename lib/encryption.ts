import crypto from "crypto";
import "server-only";

const ALG = "aes-256-cbc";


const getKey = () => {
    const passphrase = process.env.ENCRYPTION_KEY;
    if (!passphrase) throw new Error("Encryption key not found");
    return crypto.createHash("sha256").update(passphrase).digest();
};

export const symmetricEncrypted = (data: string) => {
    const key = getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALG, key, iv);
    let encrypted = cipher.update(data, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypted = (encrypted: string) => {
    const key = getKey();
    const parts = encrypted.split(":");
    if (parts.length !== 2) throw new Error("Invalid encrypted format");
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = Buffer.from(parts[1], "hex");
    const decipher = crypto.createDecipheriv(ALG, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf8");
};
