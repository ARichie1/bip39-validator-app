
export type Reason = 'invalid_length' | 'unknown_words' | 'invalid_checksum' | undefined;

export type ApiResult = {
    valid?: boolean | string[];
    invalid?: string[];
    invalidWords?: string[];
    language?: string;
    reason?: Reason;
    suggestions?: Record<string, string[]>;
    words?: string[];
};
