import { isValidMnemonic, validateWords, 
    type ValidationResult } from 'bip39-validator';

export type ValidateResponse = ValidationResult & {
    words: string[];
};


export function validateMnemonicServer(mnemonic: string, language?: string): ValidateResponse {
    const trimmed = mnemonic.trim();

    const result = isValidMnemonic(trimmed, language);
    const words = trimmed
        .split(/\s+/u)
        .map((w) => w.trim())
        .filter(Boolean);

    return {...result, words};
}

export function validateWordsServer(words: string[], language?: string) {
    return validateWords(words, language);
}