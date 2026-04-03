---
title: "Power Automate Expressions Cheat Sheet: 50+ Functions with Examples (2026)"
slug: power-automate-expressions-cheat-sheet-2026
excerpt: "Quick-reference Power Automate expressions cheat sheet — string, date, array, and logic functions with real examples."
date: "2026-04-03"
displayDate: "April 3, 2026"
readTime: "12 min read"
category: "Power Platform"
image: "/images/blog/power-automate-expressions-cheat-sheet.png"
tags:
  - "Power Automate"
  - "expressions"
  - "cheat-sheet"
  - "Power Platform"
---

## Why You Need This Cheat Sheet

Power Automate expressions are the difference between a basic flow and one that actually handles real-world data. Without them, you are stuck with static values and rigid logic. With them, you can parse dates, manipulate strings, handle nulls, and build dynamic content on the fly.

You write expressions in the **expression editor** -- click any input field in your flow, select the "Expression" tab, type your function, and hit OK. Every expression starts with a function name and returns a value that gets inserted into that field.

This cheat sheet covers every function you are likely to need, organized by category with copy-paste examples.

---

## String Functions

| Function | Syntax | Example | Output |
|----------|--------|---------|--------|
| **concat** | `concat(text1, text2, ...)` | `concat('Hello', ' ', 'World')` | `Hello World` |
| **substring** | `substring(text, startIndex, length)` | `substring('PowerAutomate', 5, 8)` | `Automate` |
| **replace** | `replace(text, oldText, newText)` | `replace('Hello World', 'World', 'Flow')` | `Hello Flow` |
| **split** | `split(text, delimiter)` | `split('a;b;c', ';')` | `["a","b","c"]` |
| **toLower** | `toLower(text)` | `toLower('HELLO')` | `hello` |
| **toUpper** | `toUpper(text)` | `toUpper('hello')` | `HELLO` |
| **trim** | `trim(text)` | `trim('  hello  ')` | `hello` |
| **indexOf** | `indexOf(text, searchText)` | `indexOf('Hello World', 'World')` | `6` |
| **length** | `length(text)` | `length('Power')` | `5` |
| **startsWith** | `startsWith(text, searchText)` | `startsWith('PowerAutomate', 'Power')` | `true` |
| **endsWith** | `endsWith(text, searchText)` | `endsWith('report.pdf', '.pdf')` | `true` |
| **contains** | `contains(text, searchText)` | `contains('Hello World', 'World')` | `true` |
| **formatNumber** | `formatNumber(number, format)` | `formatNumber(1234.5, 'C2')` | `$1,234.50` |

### String Tips

Use `concat()` instead of the `@{...}` inline syntax when you need to combine more than two dynamic values -- it is easier to debug. When checking user input, always wrap the value in `toLower()` or `toUpper()` first so your comparisons are case-insensitive.

---

## Date and Time Functions

| Function | Syntax | Example | Output |
|----------|--------|---------|--------|
| **utcNow** | `utcNow(format?)` | `utcNow('yyyy-MM-dd')` | `2026-04-03` |
| **addDays** | `addDays(timestamp, days, format?)` | `addDays(utcNow(), 7, 'yyyy-MM-dd')` | 7 days from now |
| **addHours** | `addHours(timestamp, hours, format?)` | `addHours(utcNow(), -3)` | 3 hours ago |
| **addMinutes** | `addMinutes(timestamp, minutes)` | `addMinutes(utcNow(), 30)` | 30 min from now |
| **formatDateTime** | `formatDateTime(timestamp, format)` | `formatDateTime(utcNow(), 'MM/dd/yyyy')` | `04/03/2026` |
| **convertTimeZone** | `convertTimeZone(timestamp, source, dest, format?)` | `convertTimeZone(utcNow(), 'UTC', 'Eastern Standard Time', 'hh:mm tt')` | `08:30 AM` |
| **dayOfWeek** | `dayOfWeek(timestamp)` | `dayOfWeek('2026-04-03')` | `5` (Friday) |
| **dayOfMonth** | `dayOfMonth(timestamp)` | `dayOfMonth('2026-04-03')` | `3` |
| **ticks** | `ticks(timestamp)` | `ticks('2026-01-01')` | Tick count |
| **dateDifference** | `dateDifference(startDate, endDate)` | `dateDifference('2026-01-01', '2026-04-03')` | `92.00:00:00` |

### Date Tips

The `formatDateTime()` function uses .NET custom date format strings. Common patterns: `yyyy-MM-dd` for ISO, `MM/dd/yyyy` for US, `dd/MM/yyyy` for EU, and `dddd, MMMM d, yyyy` for display (e.g., "Friday, April 3, 2026"). Always convert to the user's time zone with `convertTimeZone()` before displaying dates in emails.

---

## Collection and Array Functions

| Function | Syntax | Example | Output |
|----------|--------|---------|--------|
| **first** | `first(collection)` | `first(createArray('a','b','c'))` | `a` |
| **last** | `last(collection)` | `last(createArray('a','b','c'))` | `c` |
| **length** | `length(collection)` | `length(createArray('a','b','c'))` | `3` |
| **contains** | `contains(collection, value)` | `contains(createArray('a','b'), 'b')` | `true` |
| **join** | `join(collection, delimiter)` | `join(createArray('a','b','c'), '; ')` | `a; b; c` |
| **split** | `split(text, delimiter)` | `split('a,b,c', ',')` | `["a","b","c"]` |
| **union** | `union(collection1, collection2)` | `union(createArray(1,2), createArray(2,3))` | `[1,2,3]` |
| **intersection** | `intersection(col1, col2)` | `intersection(createArray(1,2,3), createArray(2,3,4))` | `[2,3]` |
| **skip** | `skip(collection, count)` | `skip(createArray('a','b','c'), 1)` | `["b","c"]` |
| **take** | `take(collection, count)` | `take(createArray('a','b','c'), 2)` | `["a","b"]` |
| **createArray** | `createArray(item1, item2, ...)` | `createArray(1, 2, 3)` | `[1,2,3]` |

### Array Tips

Use `empty()` to check if an array has items before looping. Combine `skip()` and `take()` for pagination. The `union()` function also works to merge two objects (not just arrays), which is useful for building dynamic JSON payloads.

---

## Logical Functions

| Function | Syntax | Example | Output |
|----------|--------|---------|--------|
| **if** | `if(expression, valueIfTrue, valueIfFalse)` | `if(equals(1,1), 'yes', 'no')` | `yes` |
| **equals** | `equals(value1, value2)` | `equals(toLower('Hello'), 'hello')` | `true` |
| **and** | `and(expr1, expr2)` | `and(greater(5,3), less(5,10))` | `true` |
| **or** | `or(expr1, expr2)` | `or(equals(1,2), equals(1,1))` | `true` |
| **not** | `not(expression)` | `not(equals(1,2))` | `true` |
| **greater** | `greater(value1, value2)` | `greater(10, 5)` | `true` |
| **greaterOrEquals** | `greaterOrEquals(value1, value2)` | `greaterOrEquals(5, 5)` | `true` |
| **less** | `less(value1, value2)` | `less(3, 5)` | `true` |
| **lessOrEquals** | `lessOrEquals(value1, value2)` | `lessOrEquals(5, 5)` | `true` |
| **empty** | `empty(value)` | `empty('')` | `true` |
| **coalesce** | `coalesce(value1, value2, ...)` | `coalesce(null, null, 'default')` | `default` |

### Logic Tips

You cannot nest `if()` more than a few levels deep before it becomes unreadable. If you need complex branching, use a **Condition** or **Switch** action instead. The `coalesce()` function is your best friend for handling null values from SharePoint or Dataverse -- it returns the first non-null value in the list.

---

## Conversion Functions

| Function | Syntax | Example | Output |
|----------|--------|---------|--------|
| **int** | `int(value)` | `int('42')` | `42` |
| **float** | `float(value)` | `float('3.14')` | `3.14` |
| **string** | `string(value)` | `string(42)` | `"42"` |
| **bool** | `bool(value)` | `bool(1)` | `true` |
| **json** | `json(value)` | `json('{"name":"test"}')` | JSON object |
| **xml** | `xml(value)` | `xml('<root><item>1</item></root>')` | XML object |
| **base64** | `base64(value)` | `base64('Hello')` | `SGVsbG8=` |
| **base64ToString** | `base64ToString(value)` | `base64ToString('SGVsbG8=')` | `Hello` |
| **decodeBase64** | `decodeBase64(value)` | `decodeBase64('SGVsbG8=')` | `Hello` |
| **uriComponent** | `uriComponent(value)` | `uriComponent('hello world')` | `hello%20world` |
| **decodeUriComponent** | `decodeUriComponent(value)` | `decodeUriComponent('hello%20world')` | `hello world` |

---

## Common Patterns

These are the expressions you will copy-paste most often in production flows.

### Format a Date as MM/dd/yyyy

When SharePoint returns an ISO timestamp and you need a clean date for an email:

```
formatDateTime(triggerOutputs()?['body/Created'], 'MM/dd/yyyy')
```

For a friendly format like "April 3, 2026":

```
formatDateTime(triggerOutputs()?['body/Created'], 'MMMM d, yyyy')
```

### Get File Extension from a Filename

Extract the extension from a file name dynamic value:

```
last(split(triggerOutputs()?['body/{FilenameWithExtension}'], '.'))
```

This splits `report-final.pdf` by the dot and returns `pdf`.

### Null-Safe Field Access

SharePoint People columns and lookup columns return null when empty. Wrap them with `coalesce()` to avoid flow failures:

```
coalesce(triggerOutputs()?['body/Manager/Email'], 'no-manager@contoso.com')
```

For numeric fields that might be null:

```
coalesce(triggerOutputs()?['body/Amount'], 0)
```

### Build a Dynamic Email Subject

Combine multiple fields into a subject line for approval emails:

```
concat('[', triggerOutputs()?['body/Department'], '] ', triggerOutputs()?['body/RequestType'], ' - ', triggerOutputs()?['body/Title'])
```

Output: `[Finance] Purchase Order - Office Supplies Q2`

For more on building approval flows, see the full guide at [Power Automate Document Approval Workflow](/blog/power-automate-document-approval).

### Calculate Business Days Between Two Dates

There is no built-in business days function. Use `dateDifference()` to get total days, then account for weekends with this approach:

```
div(mul(div(sub(ticks(outputs('EndDate')), ticks(outputs('StartDate'))), 864000000000), 5), 7)
```

This calculates a rough estimate. For exact results accounting for holidays, store holiday dates in a SharePoint list and loop through them.

### Parse JSON from an HTTP Response

When calling an external API with the HTTP action, parse the response body:

```
json(body('HTTP_Request'))?['results']
```

To safely access a nested property:

```
coalesce(json(body('HTTP_Request'))?['data']?['value'], 'Not found')
```

---

## Quick Reference: Expression Editor Shortcuts

A few things that trip up new users:

- **Accessing dynamic content in expressions**: Use `triggerOutputs()`, `outputs('ActionName')`, or `body('ActionName')` to reference values.
- **Optional chaining**: The `?` operator (e.g., `body('Get_item')?['value']`) prevents errors when a property does not exist.
- **Nested quotes**: Use single quotes inside expressions. Double quotes break the parser.
- **Testing expressions**: Use a Compose action to test any expression -- the output shows exactly what it returns.

For styled HTML output in your flow emails, check out [Power Automate HTML Table Styling with CSS](/blog/power-automate-html-table-styling-css). You can also try our interactive [Power Automate Expressions Tool](/tools/power-automate-expressions) to test functions directly in the browser.

---

## FAQ

### What is the difference between concat() and formatString()?

`concat()` joins values end-to-end: `concat('Hello', ' ', 'World')` returns `Hello World`. You can pass any number of arguments. There is no separate `formatString()` in Power Automate -- use `concat()` for all string building, or use inline expressions with `@{...}` syntax directly in action inputs for simpler cases.

### Can you nest expressions inside other expressions?

Yes, and you will do this constantly. For example, `if(empty(triggerOutputs()?['body/Email']), 'N/A', toLower(triggerOutputs()?['body/Email']))` checks if a field is empty before transforming it. Just be careful with parentheses -- one missing closing paren and the whole expression fails with a cryptic error.

### How do you handle time zones in Power Automate?

Always use `convertTimeZone()` before displaying dates to users. Power Automate stores all timestamps in UTC internally. The function takes the timestamp, source zone (usually `'UTC'`), destination zone (e.g., `'Eastern Standard Time'`), and an optional format string. You can find the full list of supported time zone names in the Microsoft documentation.

### Why does my expression return an error about "InvalidTemplate"?

This usually means one of three things: a syntax error (check your parentheses and single quotes), a type mismatch (you are passing a string where a number is expected -- use `int()` or `float()` to convert), or a null reference (the dynamic content you are referencing does not exist at runtime -- wrap it in `coalesce()`).
