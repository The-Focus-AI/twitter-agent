/**
 * `trends` Agent tool — the authenticated user's live X personalized ("For You")
 * trends via GET /2/users/personalized_trends.
 *
 * This is the LIVE trends surface — distinct from the feed-DB engagement ranking
 * (high_engagement), which only sees tweets the sync pipeline has cached. When a
 * user asks "what's trending", this is what they mean. Same per-user token path
 * as the other reads.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { perUserTokenStores } from '../../src/token-store.js';
import { XReadClient } from '../../src/x-read-client.js';
import { XAuthError } from '../../src/x-oauth.js';

interface HabitatLike {
  getSecret(name: string): string | undefined;
  setSecret(name: string, value: string): Promise<void>;
  getCurrentUserId?(): string | undefined;
}

export default (habitat: unknown) => {
  const userTokens = perUserTokenStores(habitat as HabitatLike);

  return tool({
    description:
      "Show what's trending on X (Twitter) for the authenticated user — their live " +
      'personalized "For You" trends (topics, hashtags), with post counts. Use when ' +
      'the user asks what is trending, what is happening, or about trending topics. ' +
      'This is live from X, not the tracked-feed database.',
    inputSchema: z.object({
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe('How many trends to return (default 20).'),
    }),
    async execute({ limit }) {
      const client = new XReadClient(userTokens.current());
      try {
        const trends = await client.getPersonalizedTrends();
        const sliced = trends.slice(0, limit ?? 20);
        return { count: sliced.length, trends: sliced };
      } catch (err) {
        if (err instanceof XAuthError && err.kind === 'needs_reauth') {
          return userTokens.connectError();
        }
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  });
};
