/* Titles/descriptions for the auto-generated Open Graph images. Keyed by the
   same slug used elsewhere; consumed by src/pages/og/[...route].png.ts and
   referenced from BaseHead. */
export const ogPages: Record<string, { title: string; description: string }> = {
  index: { title: 'TalkBeyondCode', description: 'Engineering conversations beyond the code' },
  podcast: { title: 'Ctrl+Shift+AI', description: 'How real engineers ship with AI · new episodes weekly' },
  articles: { title: 'Articles', description: 'Notes beyond the code' },
  signal: { title: 'Signal', description: 'What the channel is tracking' },
  creators: { title: 'Creators', description: 'Four engineers, one mic' },
}
