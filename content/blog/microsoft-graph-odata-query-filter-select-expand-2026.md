---
title: "Microsoft Graph $filter, $select & $expand: OData Cheat Sheet (2026)"
slug: microsoft-graph-odata-query-filter-select-expand-2026
excerpt: "The OData query parameters every Microsoft Graph developer needs in 2026 — $filter, $select, $expand, $orderby, $count, $search and the gotchas that bite in production."
date: "2026-05-08T09:00:00.000Z"
displayDate: "May 8, 2026"
readTime: "12 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-odata-query-filter-select-expand-2026.png"
tags:
  - "Microsoft Graph"
  - "OData"
  - "REST API"
  - "Performance"
  - "Microsoft 365"
  - "2026"
---

## Why OData Query Parameters Decide Whether Your Graph Code Scales

Microsoft Graph speaks OData. Every list endpoint accepts the same family of query parameters — `$filter`, `$select`, `$expand`, `$orderby`, `$top`, `$skip`, `$skiptoken`, `$count`, `$search`, `$format` — and how well you wield them is the single biggest factor in whether your integration runs in 200 ms or trips throttling at 1,000 users. Most performance bugs in Graph code are not auth problems or retry-policy problems; they are query problems. Someone fetched all of `/users`, pulled it back to memory, and then filtered in JavaScript.

This cheat sheet collects the OData patterns I reach for every week building production M365 integrations: which combinations are supported on which resources, the difference between `$search` and `$filter`, when you must pair `ConsistencyLevel: eventual` with `$count=true`, and the small syntax details (single quotes, lambda operators, `cast`) that decide whether your call returns 200 or 400. Examples are written against `https://graph.microsoft.com/v1.0/`; everything works the same on `/beta` unless noted.

---

## $select — Always, On Every Call

`$select` is the cheapest performance win in Graph. By default, every entity endpoint returns its full default property set, which is often 30+ fields including extension dictionaries you do not need. `$select` shrinks the response to exactly the columns you care about, which speeds up the wire transfer, reduces JSON parsing time, and — for some resources — unlocks faster server-side paths.

```http
GET /v1.0/users?$select=id,displayName,mail,userPrincipalName
```

Five rules:

- Always include `id` in `$select`. Without it you cannot follow up with PATCH, DELETE, or relationship lookups.
- The response's `@odata.context` will reflect that you asked for a projection: `...$metadata#users(id,displayName,mail,userPrincipalName)`. Trust this — if a property you asked for is missing, look at the context first.
- `$select` does **not** help with auth. You still need the broad permission required by the resource (`User.Read.All` for `/users`), even if you only ask for `displayName`.
- For navigation properties, `$select` and `$expand` compose: `$expand=manager($select=id,displayName)`. More on that below.
- `$select` cannot retrieve properties that require explicit opt-in. For example, `signInActivity` on `/users` requires `AuditLog.Read.All` and Microsoft Entra ID P1; asking for it without the licence returns 400, not an empty value.

If you are building a list view, fetch only the columns you render. If you are building a detail view, fetch the detail set in a separate call. Resist the temptation to "select everything just in case" — Graph charges you for what you ship, in latency and in throttling cost.

---

## $filter — The Syntax That Trips Everyone Up

`$filter` is OData's WHERE clause. The grammar looks simple until you hit a string with an apostrophe in it, a date that isn't quoted, or a property that quietly requires advanced query parameters.

The basic operators are the ones you would expect:

```http
GET /v1.0/users?$filter=accountEnabled eq true
GET /v1.0/users?$filter=startsWith(displayName, 'Adele')
GET /v1.0/users?$filter=mail ne null
GET /v1.0/users?$filter=createdDateTime ge 2026-01-01T00:00:00Z
GET /v1.0/groups?$filter=groupTypes/any(c:c eq 'Unified')
```

Five things to internalise:

- **Strings are single-quoted.** Double quotes return 400. Apostrophes inside strings are escaped by doubling them: `'O''Brien'`.
- **Dates are unquoted ISO 8601.** `createdDateTime ge 2026-01-01T00:00:00Z` — no quotes, always include the timezone (`Z` or offset), and use full date-time, not just `2026-01-01`.
- **`null` checks use `eq null` / `ne null`** — not `is null`. `mail eq null` matches users without a mail address.
- **`startsWith`, `endsWith`, `contains`** are functions, not operators. Argument order is `(property, value)`. `endsWith` and `contains` on `/users` and `/groups` require advanced query parameters (`ConsistencyLevel: eventual` plus `$count=true`).
- **Collections use lambda operators** — `any` and `all`. `assignedLicenses/any(l:l/skuId eq guid'...')` matches users with at least one matching licence. `all` is rarely supported; assume `any` unless docs say otherwise.

A common bug: combining filters with `and`/`or` while forgetting precedence. Graph requires explicit parentheses for mixed boolean groups:

```http
GET /v1.0/users?$filter=(accountEnabled eq true) and (startsWith(displayName,'A') or startsWith(displayName,'B'))
```

Without the parens, Graph either errors or — worse — interprets `and` as binding tighter than `or` in ways that silently change your result set. Always parenthesise.

---

## Advanced Query Parameters — The `ConsistencyLevel: eventual` Header

Some `$filter` and `$orderby` operations on directory objects (`/users`, `/groups`, `/applications`, `/servicePrincipals`, `/devices`) require Graph's **advanced query parameters** mode. You opt in with two things on the same request:

- The header `ConsistencyLevel: eventual`
- The query parameter `$count=true`

Without both, the request returns a 400 with `Request_UnsupportedQuery`. With both, you unlock:

- `endsWith`, `not`, `ne` on string properties
- `$search` on `/users`, `/groups`, `/applications`
- `$orderby` combined with `$filter` on the same property
- `$count` returning the total in `@odata.count`

```http
GET /v1.0/users?$filter=endsWith(mail,'@contoso.com')&$count=true
ConsistencyLevel: eventual
```

In the official SDKs, you set the header per-request:

```ts
import { Client } from "@microsoft/microsoft-graph-client";

const users = await client
  .api("/users")
  .header("ConsistencyLevel", "eventual")
  .count(true)
  .filter("endsWith(mail, '@contoso.com')")
  .select("id,displayName,mail")
  .get();

console.log("Total matching:", users["@odata.count"]);
```

Rule of thumb: if you are filtering directory objects and the docs do not explicitly say it works without advanced query, set `ConsistencyLevel: eventual` and `$count=true`. The cost is negligible and it eliminates a whole class of "works in dev, 400s in prod when the data shape changes" bugs.

---

## $expand — Pulling Related Entities In One Call

`$expand` follows navigation properties so you do not have to make a second round trip. The classic case is fetching a user along with their manager:

```http
GET /v1.0/users/adele@contoso.com?$expand=manager
```

You can nest `$select` inside `$expand` to project the related entity:

```http
GET /v1.0/users?$expand=manager($select=id,displayName)&$select=id,displayName,manager
```

Three rules:

- **Each resource has a hard cap on how many entities you can expand.** On `/users` it is 20 manager entries; on `/groups/{id}/members` it is 20 too. Beyond that, page or call separately.
- **`$expand` is not transitive.** `$expand=manager` returns the direct manager, not the manager's manager. To go further, follow up: `GET /users/{id}/manager?$expand=manager`.
- **Some collections can only be expanded with `$select`** for the parent. For example, group `members` expansion on a list of groups needs `$select=id,displayName,members`; otherwise Graph either ignores the expansion or returns 400.

For SharePoint sites, `$expand=lists` works but is rate-limited — fetch lists separately if you need more than the few that fit in one response.

---

## $orderby, $top, and Paging With $skiptoken

Graph paginates lazily. You ask for `$top=N`, you get up to N rows, plus an `@odata.nextLink` you call to get the next page. Do not parse the nextLink — pass it back as-is:

```ts
async function getAllUsers(client: Client) {
  const all: any[] = [];
  let response = await client
    .api("/users")
    .select("id,displayName,mail")
    .top(100)
    .get();

  while (response) {
    all.push(...response.value);
    if (!response["@odata.nextLink"]) break;
    response = await client.api(response["@odata.nextLink"]).get();
  }
  return all;
}
```

Things to know:

- **Default page size varies by resource.** `/users` returns 100. `/messages` returns 10. Always pass an explicit `$top` so you do not get surprised in the next quarter when defaults change.
- **Maximum `$top` is 999** for most resources. Beyond that, page.
- **`$skip` is not supported on most directory endpoints.** Use `$skiptoken` (which Graph provides via `nextLink`) instead. `$skip` works on Outlook resources like `/me/messages`.
- **`$orderby` must reference the same property as your `$filter`** when filtering on directory objects, unless you opt into advanced query parameters. `$orderby=displayName` after `$filter=startsWith(displayName,'A')` is fine; `$orderby=createdDateTime` with that filter is not, without `ConsistencyLevel: eventual`.

---

## $count, $search, and the Difference Between Them

`$count` and `$search` look similar and do completely different things.

`$count=true` adds a `@odata.count` property to the response with the total number of matching entities. It is a counter, not a filter. Useful for pagination UIs.

`$search` performs a relevance-ranked text search across a configured set of properties. It does not use OData equality semantics — it tokenises, stems, and ranks. Search is supported on a narrow set of resources (`/users`, `/groups`, `/applications`, `/messages`, `/sites`, `/drives/{id}/root`) and the syntax is property-scoped:

```http
GET /v1.0/users?$search="displayName:Adele" OR "mail:adele"
ConsistencyLevel: eventual
```

Rules of thumb:

- Use `$filter` for exact matches, ranges, and structured predicates.
- Use `$search` for "find me anything that mentions Adele" — fuzzy, ranked, multi-property.
- `$search` strings must be double-quoted inside the query value (`"displayName:Adele"`). The query value itself is then URL-encoded.
- `$search` always requires `ConsistencyLevel: eventual` on directory resources.

If you find yourself writing `$filter=contains(displayName,'adele') or contains(mail,'adele') or contains(givenName,'adele')`, stop and use `$search` instead. It is what the parameter exists for, and the relevance ranking gives users a much better experience than a literal substring match.

---

## Common Pitfalls

A short list of the OData query mistakes I see most often in code reviews:

- **Filtering a property that is not stored**, like `signInActivity.lastSignInDateTime` without the licence. Graph returns 400 or 403. Check the resource's required permissions and licence prerequisites before adding any filter on a less-common property.
- **Forgetting that string comparison is case-sensitive** on most directory properties. `mail eq 'Adele@contoso.com'` will not match a user whose mail is stored lowercase. Normalise first or use `tolower(mail) eq 'adele@contoso.com'`.
- **Mixing `$expand` with `$top` on a relationship endpoint**. `$top` applies to the outer collection, not the expanded one. To limit related entities, expand a specific subset: `$expand=members($top=10)` — and remember it only works on resources that explicitly support it.
- **Forgetting that `$count` is a query parameter, not a path segment**, on collection endpoints. `GET /users/$count` is a valid path that returns just a number; `GET /users?$count=true` is a different thing that returns the collection plus the count. Both are useful, but they are not the same call.
- **Using `$filter` for a case-insensitive substring on a million-row tenant**. Even with advanced query parameters this is slow. Reach for `$search` or build a proper directory-search UX.

---

## Putting It Together — A Realistic User Picker Query

A user picker control needs to find the top 10 enabled users matching what the operator typed, ordered by display name, with their manager and a couple of properties. The right query looks like this:

```http
GET /v1.0/users
  ?$filter=accountEnabled eq true
  &$search="displayName:adele" OR "mail:adele"
  &$select=id,displayName,mail,userPrincipalName,jobTitle
  &$expand=manager($select=id,displayName)
  &$top=10
  &$count=true
ConsistencyLevel: eventual
```

In SDK form:

```ts
const result = await client
  .api("/users")
  .header("ConsistencyLevel", "eventual")
  .count(true)
  .filter("accountEnabled eq true")
  .search('"displayName:adele" OR "mail:adele"')
  .select("id,displayName,mail,userPrincipalName,jobTitle")
  .expand("manager($select=id,displayName)")
  .top(10)
  .get();
```

That single call replaces what naive code would do as: list all users, filter client-side, fetch each user's manager separately, sort. The naive version is six round trips per keystroke and breaks at 1,000+ users. This version is one round trip and scales linearly.

---

## FAQ

**Do these query parameters work the same on `/beta`?** Mostly yes. A few advanced filters land on `/beta` first; check the docs for the specific resource. Production code should stay on `/v1.0`.

**Does `$filter` count against my throttling budget more than no filter?** No. The cost is per-resource per-app, not per-property. A heavily filtered call costs the same as an unfiltered one. Filter aggressively.

**Can I combine `$filter` and `$search` in the same call?** On `/users`, `/groups`, `/applications` — yes, with `ConsistencyLevel: eventual`. On other resources — usually no; the docs will tell you.

**What about `$apply` for aggregation?** Graph supports a small subset of `$apply` (mostly on usage reports). For real aggregation you want either Microsoft Graph Data Connect or to fetch and aggregate in your own code. Do not lean on `$apply` for general analytics.

**How do I debug a 400 from a complex query?** Strip the query parameters one at a time until the request succeeds, then add them back. Graph's error message tells you which parameter is at fault but rarely tells you why. Iterative bisection is faster than reading the spec.

---

## Wrap-Up

Get OData query parameters right and your Graph integration is fast, cheap, and predictable. Get them wrong and you ship code that works fine in dev, then dies the first time it hits a real-tenant directory. The patterns to internalise are: `$select` on every call, `$filter` with single-quoted strings and ISO dates, advanced query parameters (`ConsistencyLevel: eventual` + `$count=true`) for any non-trivial filter on directory objects, `$expand` to avoid round trips, `$search` for fuzzy text, `$skiptoken` (via `nextLink`) for paging.

For deeper dives on the surrounding Graph topics, see [Microsoft Graph $batch: 20 API Calls in One Request](/blog/microsoft-graph-batch-requests-combine-api-calls-2026), [Microsoft Graph Throttling: Surviving 429s](/blog/microsoft-graph-throttling-survive-429-retry-backoff-2026), and [Microsoft Graph Delta Query: Incremental Sync](/blog/microsoft-graph-delta-query-incremental-sync-2026). Each one composes with the OData parameters covered here, and together they cover the operational triangle — efficient queries, batched round trips, and graceful retries — that production Graph code lives or dies by.
