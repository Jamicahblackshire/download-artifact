/**
 * Secure Credential Manager
 * Encrypts and manages API keys for all integrated services
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const CREDENTIALS_FILE = path.join(process.cwd(), '.credentials.encrypted');

interface EncryptedCredential {
  iv: string;
  encryptedData: string;
  algorithm: string;
}

class CredentialManager {
  private key: Buffer;
  private credentials: Map<string, string> = new Map();

  constructor(encryptionKey: string = ENCRYPTION_KEY) {
    this.key = Buffer.from(encryptionKey, 'hex');
    this.loadCredentials();
  }

  /**
   * Encrypt a credential value
   */
  private encrypt(value: string): EncryptedCredential {
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
  private decrypt(credential: EncryptedCredential): string {
    const iv = Buffer.from(credential.iv, 'hex');
    const decipher = crypto.createDecipheriv(credential.algorithm, this.key, iv);
    let decrypted = decipher.update(credential.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Set a credential
   */
  setCredential(service: string, key: string, value: string): void {
    const fullKey = `${service}:${key}`;
    this.credentials.set(fullKey, value);
    this.saveCredentials();
  }

  /**
   * Get a credential
   */
  getCredential(service: string, key: string): string | null {
    const fullKey = `${service}:${key}`;
    return this.credentials.get(fullKey) || null;
  }

  /**
   * Get all credentials for a service
   */
  getServiceCredentials(service: string): Record<string, string> {
    const serviceCredentials: Record<string, string> = {};
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
  private saveCredentials(): void {
    const encryptedCredentials: Record<string, EncryptedCredential> = {};

    for (const [key, value] of this.credentials.entries()) {
      encryptedCredentials[key] = this.encrypt(value);
    }

    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(encryptedCredentials, null, 2), 'utf8');
    console.log(`✓ Credentials saved to ${CREDENTIALS_FILE}`);
  }

  /**
   * Load encrypted credentials from file
   */
  private loadCredentials(): void {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
      return;
    }

    const encryptedData = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

    for (const [key, credential] of Object.entries(encryptedData)) {
      try {
        const decrypted = this.decrypt(credential as EncryptedCredential);
        this.credentials.set(key, decrypted);
      } catch (error) {
        console.error(`Failed to decrypt credential: ${key}`);
      }
    }

    console.log(`✓ Loaded ${this.credentials.size} encrypted credentials`);
  }

  /**
   * Export credentials as environment variables
   */
  toEnvironmentVariables(): Record<string, string> {
    const env: Record<string, string> = {};

    for (const [key, value] of this.credentials.entries()) {
      const envKey = key.toUpperCase().replace(':', '_');
      env[envKey] = value;
    }

    return env;
  }
}

export default new CredentialManager();