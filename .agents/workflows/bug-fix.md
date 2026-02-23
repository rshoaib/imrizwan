---
description: Systematic bug fix workflow with Claude Opus 4.5
---

# Bug Fix Workflow (Use Claude Opus 4.5)

## Step 1: Reproduce
1. Open the affected page in browser
2. Capture screenshot of the bug
3. Check browser console for errors
4. Check network requests for failed API calls

## Step 2: Diagnose
5. Trace the error from UI → component → server action → database
6. Check RLS policies if Supabase related
7. Check authentication state if auth-related
8. Review recent git changes: `git log --oneline -10`

## Step 3: Fix
9. Make the minimal targeted fix
10. Add error handling and user feedback
// turbo
11. Run TypeScript check: `npx tsc --noEmit`

## Step 4: Verify
12. Test the fix in browser
13. Test edge cases (rapid clicks, empty states, error states)
// turbo
14. Push to production: `git add -A && git commit -m "fix: description" && git push origin main`

## Step 5: Confirm
15. Verify fix on production after Vercel deployment
16. Take screenshot as proof
