"use strict";
/**
 * Secure Credential Manager
 * Encrypts and manages API keys for all integrated services
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const CREDENTIALS_FILE = path.join(process.cwd(), '.credentials.encrypted');
class CredentialManager {
    constructor(encryptionKey = ENCRYPTION_KEY) {
        this.credentials = new Map();
        this.key = Buffer.from(encryptionKey, 'hex');
        this.loadCredentials();
    }
    /**
     * Encrypt a credential value
     */
    encrypt(value) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted,
            algorithm: 'aes-256-cbc',
        };
    }
    /**
     * Decrypt a credential value
     */
    decrypt(credential) {
        const iv = Buffer.from(credential.iv, 'hex');
        const decipher = crypto.createDecipheriv(credential.algorithm, this.key, iv);
        let decrypted = decipher.update(credential.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    /**
     * Set a credential
     */
    setCredential(service, key, value) {
        const fullKey = `${service}:${key}`;
        this.credentials.set(fullKey, value);
        this.saveCredentials();
    }
    /**
     * Get a credential
     */
    getCredential(service, key) {
        const fullKey = `${service}:${key}`;
        return this.credentials.get(fullKey) || null;
    }
    /**
     * Get all credentials for a service
     */
    getServiceCredentials(service) {
        const serviceCredentials = {};
        for (const [key, value] of this.credentials.entries()) {
            if (key.startsWith(`${service}:`)) {
                const credKey = key.replace(`${service}:`, '');
                serviceCredentials[credKey] = value;
            }
        }
        return serviceCredentials;
    }
    /**
     * Save encrypted credentials to file
     */
    saveCredentials() {
        const encryptedCredentials = {};
        for (const [key, value] of this.credentials.entries()) {
            encryptedCredentials[key] = this.encrypt(value);
        }
        fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(encryptedCredentials, null, 2), 'utf8');
        console.log(`✓ Credentials saved to ${CREDENTIALS_FILE}`);
    }
    /**
     * Load encrypted credentials from file
     */
    loadCredentials() {
        if (!fs.existsSync(CREDENTIALS_FILE)) {
            return;
        }
        const encryptedData = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));
        for (const [key, credential] of Object.entries(encryptedData)) {
            try {
                const decrypted = this.decrypt(credential);
                this.credentials.set(key, decrypted);
            }
            catch (error) {
                console.error(`Failed to decrypt credential: ${key}`);
            }
        }
        console.log(`✓ Loaded ${this.credentials.size} encrypted credentials`);
    }
    /**
     * Export credentials as environment variables
     */
    toEnvironmentVariables() {
        const env = {};
        for (const [key, value] of this.credentials.entries()) {
            const envKey = key.toUpperCase().replace(':', '_');
            env[envKey] = value;
        }
        return env;
    }
}
exports.default = new CredentialManager();
//# sourceMappingURL=credential-manager.js.map