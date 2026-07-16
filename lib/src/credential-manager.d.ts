/**
 * Secure Credential Manager
 * Encrypts and manages API keys for all integrated services
 */
declare class CredentialManager {
    private key;
    private credentials;
    constructor(encryptionKey?: string);
    /**
     * Encrypt a credential value
     */
    private encrypt;
    /**
     * Decrypt a credential value
     */
    private decrypt;
    /**
     * Set a credential
     */
    setCredential(service: string, key: string, value: string): void;
    /**
     * Get a credential
     */
    getCredential(service: string, key: string): string | null;
    /**
     * Get all credentials for a service
     */
    getServiceCredentials(service: string): Record<string, string>;
    /**
     * Save encrypted credentials to file
     */
    private saveCredentials;
    /**
     * Load encrypted credentials from file
     */
    private loadCredentials;
    /**
     * Export credentials as environment variables
     */
    toEnvironmentVariables(): Record<string, string>;
}
declare const _default: CredentialManager;
export default _default;
//# sourceMappingURL=credential-manager.d.ts.map