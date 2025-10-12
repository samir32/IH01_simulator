# Issue Backlog

## 1. Safely generate IDs for newly created nodes — ✅ Implemented
- **Problem (resolved):** `addNewItem` calculated the next ID with `Math.max(...getAllIds(treeData))`, which failed when the tree was empty or when IDs were non-numeric (e.g., the default "NEW-*" IDs). In those cases `Math.max` received an empty array and returned `-Infinity`, so new items ended up with the ID `-Infinity` and broke subsequent operations. The helper also dropped non-numeric IDs entirely. The new logic tracks all IDs, finds the next numeric slot when available, and otherwise mints stable string identifiers via `generateStringId`. 【F:src/components/sap-classic-tree-enhanced.tsx†L432-L508】
- **Outcome:** New nodes are assigned unique IDs regardless of whether the existing dataset uses numeric or string identifiers.

## 2. Avoid mutating state while deleting nodes — ✅ Implemented
- **Problem (resolved):** `findAndDeleteItem` reassigned `item.children` on the existing object before returning it from `.filter`, mutating the current tree state in place. This caused subtle rendering bugs because React components kept receiving the same object references. The deletion helper now builds new arrays and only returns a new tree when something changed. 【F:src/components/sap-classic-tree-enhanced.tsx†L404-L430】
- **Outcome:** Tree updates propagate reliably without mutating previously rendered objects.

## 3. Fix malformed sample CSV export — ✅ Implemented
- **Problem (resolved):** The sample CSV string used for downloads started with an unmatched quote, producing invalid CSV headers for users who rely on the sample file. The new template provides clean headers and an updated hierarchy example. 【F:src/components/file-uploader.tsx†L257-L287】
- **Outcome:** Sample downloads import correctly in spreadsheet tools and match the hierarchy structure.

## 4. Support clearing imported data — ✅ Implemented
- **Problem (resolved):** When `SapClassicTreeEnhanced` received an empty `data` array, the guard `if (data && data.length > 0)` prevented the component from clearing its internal state, leaving stale items visible after the user uploaded a file with no rows. The effect now detects invalid input, resets to defaults, or clears the tree when an empty array arrives. 【F:src/components/sap-classic-tree-enhanced.tsx†L368-L381】
- **Outcome:** Clearing imports or uploading empty files immediately removes the rendered hierarchy.

## 5. Improve CSV parsing robustness — ✅ Implemented
- **Problem (resolved):** The previous CSV parser split on every comma, so any field containing commas or quoted values was parsed incorrectly—common in equipment descriptions. The new quote-aware tokenizer respects escaped quotes, normalizes headers, and returns hierarchical data through `buildHierarchy`. 【F:src/components/file-uploader.tsx†L43-L235】
- **Outcome:** Uploads keep complex descriptions intact and preserve parent-child relationships.
