import { decodeContent, isLinkExpired } from "@/libs/share";
import type { PreviewRenderer } from "@/features/markdown-editor/constants";
import { SharePreview } from "@/features/markdown-editor/SharePreview";

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; f?: string; p?: string; exp?: string }>;
}) {
  const { c, f, p, exp } = await searchParams;
  const expiresAt = exp ? parseInt(exp, 10) : null;
  const isExpired = isLinkExpired(expiresAt);
  const content = c ? decodeContent(c) : "";
  const format: PreviewRenderer = f === "html" ? "html" : "markdown";

  return (
    <SharePreview
      content={content}
      format={format}
      publisher={p}
      isExpired={isExpired}
      expiresAt={expiresAt}
    />
  );
}

