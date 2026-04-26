import type { Code } from "@/types";

export const FORMAT_NUMBERED = "Numbered List";
export const FORMAT_RAW = "Raw Codes (one per line)";
export const FORMAT_SPACE = "Space-Separated";
export const FORMAT_COMMA = "Comma-Separated";

export const FORMATS = [
  FORMAT_NUMBERED,
  FORMAT_RAW,
  FORMAT_SPACE,
  FORMAT_COMMA,
] as const;

export type FormatKind = (typeof FORMATS)[number];

export const BLOCK_SIZE = 10;

export function formatCodes(
  codes: string[],
  startIdx: number,
  fmt: FormatKind
): string {
  if (codes.length === 0) return "";
  switch (fmt) {
    case FORMAT_NUMBERED:
      return codes.map((c, i) => `${startIdx + i + 1}. ${c}`).join("\n");
    case FORMAT_RAW:
      return codes.join("\n");
    case FORMAT_SPACE:
      return codes.join(" ");
    case FORMAT_COMMA:
      return codes.join(",");
    default:
      return codes.join("\n");
  }
}

export function blockCount(total: number): number {
  if (total === 0) return 0;
  return Math.ceil(total / BLOCK_SIZE);
}

export function blockSlice(
  codes: Code[],
  blockIdx: number
): { codes: Code[]; startIdx: number } {
  if (blockIdx <= 0) return { codes, startIdx: 0 };
  const start = (blockIdx - 1) * BLOCK_SIZE;
  return {
    codes: codes.slice(start, start + BLOCK_SIZE),
    startIdx: start,
  };
}

export function exportMarkdown(codes: string[], fmt: FormatKind): string {
  const n = codes.length;
  const header = `# Pokémon TCG Codes\n\n_Exported from CodeDex Pro · ${n} codes_\n\n`;
  switch (fmt) {
    case FORMAT_NUMBERED:
      return (
        header +
        "## Numbered List\n\n" +
        codes.map((c, i) => `${i + 1}. \`${c}\``).join("\n") +
        "\n"
      );
    case FORMAT_RAW:
      return header + "## Raw Codes\n\n```\n" + codes.join("\n") + "\n```\n";
    case FORMAT_SPACE:
      return (
        header +
        "## Space-Separated\n\n```\n" +
        codes.join(" ") +
        "\n```\n"
      );
    case FORMAT_COMMA:
      return (
        header +
        "## Comma-Separated\n\n```\n" +
        codes.join(",") +
        "\n```\n"
      );
  }
}

export function downloadBlob(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
