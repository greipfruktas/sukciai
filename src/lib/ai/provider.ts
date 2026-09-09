export interface GenerateJsonRequest {
  system: string;
  input: string;
}

export interface LanguageModelProvider {
  generateJson(request: GenerateJsonRequest): Promise<unknown>;
}
