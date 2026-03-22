import * as TOML from "@iarna/toml";

export type TomlDocument = Record<string, unknown>;

export function parseTomlDocument(source: string): TomlDocument {
  if (!source.trim()) {
    return {};
  }

  return TOML.parse(source) as TomlDocument;
}

export function stringifyTomlDocument(document: TomlDocument) {
  return `${TOML.stringify(document).trimEnd()}\n`;
}