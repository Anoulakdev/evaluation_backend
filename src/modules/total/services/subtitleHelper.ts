import { PrismaService } from '../../../prisma/prisma.service';

let cachedSubtitleCount: number | null = null;
let lastSubtitleCountTime = 0;
const SUBTITLE_CACHE_TTL = 60 * 1000; // 1 minute TTL cache

export async function getSubtitleCount(prisma: PrismaService): Promise<number> {
  const now = Date.now();
  if (
    cachedSubtitleCount !== null &&
    now - lastSubtitleCountTime < SUBTITLE_CACHE_TTL
  ) {
    return cachedSubtitleCount;
  }
  try {
    const count = await prisma.subTitle.count();
    cachedSubtitleCount = count;
    lastSubtitleCountTime = now;
    return count;
  } catch {
    return cachedSubtitleCount ?? 16;
  }
}
