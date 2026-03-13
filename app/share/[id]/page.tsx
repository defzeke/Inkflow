import { Redis } from "@upstash/redis";
import { isLinkExpired } from "@/libs/share";
import { SharePreview } from "@/features/markdown-editor/SharePreview";
import type { ShareFormat } from "@/libs/share";

interface ShareData {
  content: string;
  format: ShareFormat;
  publisher?: string;
  expiresAt: number;
}

export default async function ShareByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data: ShareData | null = null;
  try {
    const redis = Redis.fromEnv();
    data = await redis.get<ShareData>(`share:${id}`);
  } catch {
    // Redis not configured or unavailable
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-2xl">🔍</p>
        <h1 className="text-base font-semibold text-gray-700">
          Link Not Found
        </h1>
        <p className="text-sm text-gray-400">
          This share link doesn&apos;t exist or has already expired.
        </p>
      </div>
    );
  }

  return (
    <SharePreview
      content={data.content}
      format={data.format === "html" ? "html" : "markdown"}
      publisher={data.publisher}
      isExpired={isLinkExpired(data.expiresAt)}
      expiresAt={data.expiresAt}
    />
  );
}
