/* Titles/descriptions/kickers for the auto-generated Open Graph images.
   Keyed by the same slug used elsewhere; consumed by
   src/pages/og/[...route].ts and referenced from BaseHead. */
export const ogPages: Record<string, { title: string; description: string; kicker: string }> = {
  index: {
    title: 'Engineering conversations beyond the code',
    description: 'Four working engineers on building, breaking and shipping with AI',
    kicker: 'ENGINEERING MEDIA CHANNEL',
  },
  podcast: {
    title: 'Ctrl+Shift+AI',
    description: 'How real engineers ship with AI · new episodes weekly',
    kicker: 'THE PODCAST · SEASON 01',
  },
  articles: {
    title: 'Notes beyond the code',
    description: 'Long-form writing from the channel: AI in practice, tooling, careers',
    kicker: 'ARTICLES',
  },
  signal: {
    title: 'What the channel is tracking',
    description: 'Links and notes worth your attention, curated by the four of us',
    kicker: 'SIGNAL',
  },
  creators: {
    title: 'Four engineers, one mic',
    description: 'The people behind TalkBeyondCode and Ctrl+Shift+AI',
    kicker: 'CREATORS',
  },
}
