import { getCollection, type CollectionEntry } from 'astro:content'

export type SignalEntry = CollectionEntry<'signal'>

/* Published signal items, newest first. Drafts (collector candidates that
   haven't been reviewed yet) never leave this function. */
export async function publishedSignal(): Promise<SignalEntry[]> {
  const items = await getCollection('signal', ({ data }) => !data.draft)
  return items.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title),
  )
}

/* The feed shows month-level dates ("Jun 2026") — signal is a weekly-ish
   stream, not a timestamped log. */
export function signalDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
