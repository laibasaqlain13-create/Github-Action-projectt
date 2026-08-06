# Task: Fix Messages Duplicate Heading & Page Scroll on Chat Page

## Status: ✅ Complete

### Changes Made
1. ✅ **ConversationList.tsx** - Removed duplicate `<h1>Messages</h1>` heading from the sidebar header
2. ✅ **ChatBox.tsx** - Fixed page scrolling:
   - Added `flex flex-col max-h-dvh` to the outer section (constrains height to viewport)
   - Replaced `min-h-[620px]` with `min-h-0 flex-1` on the inner grid (prevents forced overflow)
   - Removed `min-h-[400px]` from the messages panel div
   - Kept `overflow-hidden` to prevent any scroll

### Summary
- "Messages" now appears **only once** (in the ChatBox main header at top)
- The page **no longer scrolls** — the chat panel is constrained within the viewport
