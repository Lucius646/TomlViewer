import * as TOML from "@iarna/toml";

export type TomlDocument = Record<string, unknown>;

export function parseTomlDocument(source: string): TomlDocument {
  if (!source.trim()) {
    return {};
  }

  return TOML.parse(source) as TomlDocument;
}

export function stringifyTomlDocument(document: TomlDocument) {
  const tomlCompatibleDocument = document as Parameters<typeof TOML.stringify>[0];

  return `${TOML.stringify(tomlCompatibleDocument).trimEnd()}\n`;
}