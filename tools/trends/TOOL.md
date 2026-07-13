---
name: trends
description: "Show what's currently trending on X (Twitter) for the authenticated user — their live personalized 'For You' trends (topics and hashtags), each with a post count. Use this whenever the user asks what's trending, what's happening, or about trending topics. This reads LIVE from X via the user's own OAuth token — it is NOT the tracked-feed database (use high_engagement/list_digest for that). Optional `limit` controls how many trends to return (default 20)."
---

Show the authenticated user's live personalized ("For You") trends from X.

Live data, read through the user's own official X OAuth token (managed by the X
token store). This is the right tool for "what's trending" / "what's happening"
— distinct from `high_engagement`, which ranks tweets already cached in the
tracked-feed database. Optional `limit` (default 20).
