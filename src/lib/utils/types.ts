export type ValidationError =
  | "invalid_words"
  | "invalid_length"
  | "unknown_words"
  | "invalid_checksum"
  | ""

export type ApiResult = {
    valid?: boolean;
    language?: string;
    error?: ValidationError;
    validWords?: string[];
    invalidWords?: string[];
    suggestions?: Record<string, string[]>;
    words?: string[];
};