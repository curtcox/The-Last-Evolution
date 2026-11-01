# Reference scans

| file | what | source |
|---|---|---|
| `amazing_1932-08_p414.jpg` | *Amazing Stories* v7 n5, August 1932, page 414: the story's title page, with the editor's introduction and the byline | [archive.org](https://archive.org/details/Amazing_Stories_v07n05_1932-08_Missing_ibcbc_cape1736), leaf n31 |
| `morey_1932_p415.jpg` | page 415: Leo Morey's full-page illustration. F-1's tentacles hold the new F-2 in its aura while a man looks on. Its caption: "An enormous aura of white light surrounded the small torpedo of metal, and it was shot through with crackling streamers of blue lightning." | the same issue, leaf n32 |

## Copyright

Both are in the public domain in the United States (checked 2026-11-01). Works published in 1932 needed their US
copyright renewed in 1959–60 to stay protected. According to the University of Pennsylvania's
[first periodical renewals](https://onlinebooks.library.upenn.edu/cce/firstperiod.html) index, *Amazing Stories*'
issues were renewed only from May 1954, and its contributions only from December 1932. Neither covers the August 1932
issue, so neither covers the story or its illustration. That matches Project Gutenberg's finding for the text.

The scan is of the **1932** printing, not the March 1961 reprint that Gutenberg transcribed. The 1961 issue falls
after the date issue renewals began, so it isn't used.

## Two findings for later phases

- **The 1932 printing opens with an editor's introduction** that the Gutenberg text (from 1961) doesn't have. It begins
  "It must be the dream of countless numbers to reach the acme of evolution". It isn't part of the story, so it isn't
  voiced (PLAN.md §3), but it belongs on the site's history notes.
- **The 1932 and 1961 texts may differ.** Phase 2 compares them, using this issue's OCR as a guide and the page
  images to settle each difference, and reports any differences for a decision on which text the film follows.

## Added in Phase 2

| file | what | from |
|---|---|---|
| `amazing_1932-08_ocr_story.txt` | archive.org's OCR of the story's pages in the August 1932 issue, from "I AM the last" to "change your belief" | the 1932 item's `_djvu.txt` |
| `amazing_1961-03_ocr_story.txt` | the same for the March 1961 reprint, which Gutenberg transcribed | [archive.org](https://archive.org/details/Amazing_Stories_v35n03_1961-03_UnkSc-cape1736), its `_djvu.txt` |
| `1932/` | crops of the 1932 page scans, each showing a passage where the printings differ, named by page and paragraphs | the 1932 item's page images |

`tools/compare_printings.mjs` compares both OCR texts with Gutenberg's; [text/comparison_1932.md](../../text/comparison_1932.md)
sets out what it found.
