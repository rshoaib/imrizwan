---
title: "Microsoft Graph Toolkit: Build M365-Powered Web Apps with Zero Backend Code (2026)"
slug: microsoft-graph-toolkit-web-apps-guide-2026
excerpt: "Learn how to use Microsoft Graph Toolkit components to display people, files, calendars, and tasks from Microsoft 365 in any web app — with full code examples and authentication setup."
date: "2026-04-13T08:00:00.000Z"
displayDate: "April 13, 2026"
readTime: "8 min read"
category: "Microsoft 365"
image: "/images/blog/microsoft-graph-toolkit-web-apps-guide-2026.png"
tags:
  - "Microsoft Graph Toolkit"
  - "Microsoft Graph"
  - "Microsoft 365"
  - "Web Development"
  - "MSAL"
  - "Authentication"
---

## Why Microsoft Graph Toolkit Exists

If you've worked with the Microsoft Graph API directly, you know the pattern: authenticate with MSAL, call a REST endpoint, parse the JSON response, build the UI to display it, handle loading states, and deal with pagination. It works — but it's a lot of plumbing for showing a user's profile picture or a list of upcoming calendar events.

Microsoft Graph Toolkit (MGT) eliminates that plumbing. It's a collection of web components that connect directly to Microsoft Graph, handle their own authentication, manage loading and error states, and render M365 data with sensible defaults. Drop `<mgt-person>` into your HTML, configure a provider, and you get a rendered user card with photo, name, and presence — no fetch calls, no state management, no custom CSS.

As of early 2026, MGT v4 ships with 20+ components, supports React/Angular/Vue wrappers out of the box, and works with MSAL 2.x for authentication. If you're building any web application that needs to surface Microsoft 365 data, this is the fastest path from zero to working UI.

## Setting Up Authentication

Every MGT component needs a **provider** — the layer that handles authentication and passes tokens to Graph API calls. For most web apps, you'll use the MSAL2 provider.

### Register Your App in Entra ID

Before writing any code, create an app registration:

1. Go to [entra.microsoft.com](https://entra.microsoft.com) → **App registrations** → **New registration**
2. Name it something like `MGT Demo App`
3. Set **Redirect URI** to `http://localhost:3000` (type: Single-page application)
4. Under **API permissions**, add these delegated Microsoft Graph permissions:
   - `User.Read`
   - `People.Read`
   - `Calendars.Read`
   - `Files.Read`
   - `Tasks.Read`
5. Click **Grant admin consent** if you have admin access (otherwise users will see a consent prompt)

Copy the **Application (client) ID** — you'll need it in the next step.

### Initialize the Provider

Install MGT and the MSAL2 provider:

```bash
npm install @microsoft/mgt-element @microsoft/mgt-components @microsoft/mgt-msal2-provider
```

In your app's entry point, register the provider before any MGT components render:

```typescript
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';

Providers.globalProvider = new Msal2Provider({
  clientId: 'YOUR_CLIENT_ID',
  scopes: [
    'User.Read',
    'People.Read',
    'Calendars.Read',
    'Files.Read',
    'Tasks.Read'
  ]
});
```

That's it. Every MGT component on the page will now use this provider to authenticate and fetch data. The MSAL2 provider handles token caching, silent renewal, and the interactive login popup automatically.

### Quick Test with CDN (No Build Tools)

If you want to try MGT without any build setup, use the CDN bundle. Create an `index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@microsoft/mgt@4/dist/bundle/mgt-loader.js"></script>
</head>
<body>
  <mgt-msal2-provider client-id="YOUR_CLIENT_ID"></mgt-msal2-provider>
  <mgt-login></mgt-login>
  <mgt-person person-query="me" view="twolines" show-presence></mgt-person>
</body>
</html>
```

Open it in a browser, click the login button, and you'll see your profile rendered immediately. This is the fastest way to validate that your app registration and permissions are correct before integrating into a real project.

## The Components You'll Actually Use

MGT ships with a large component library, but in practice, five components cover the vast majority of use cases. Here's what each does and how to use it effectively.

### mgt-person and mgt-people

The `mgt-person` component renders a single user — photo, name, email, and presence status. It's the component you'll reach for most often.

```html
<!-- Show the signed-in user -->
<mgt-person person-query="me" view="twolines" show-presence></mgt-person>

<!-- Show a specific user by email -->
<mgt-person person-query="alex@contoso.com" view="threelines"></mgt-person>

<!-- Show a user by their Azure AD ID -->
<mgt-person user-id="2e5e6c4f-1a2b-3c4d-5e6f-7a8b9c0d1e2f"></mgt-person>
```

The `view` attribute controls how much detail is shown: `oneline` (name only), `twolines` (name + email), or `threelines` (name + email + job title). Adding `show-presence` displays the green/yellow/red availability indicator from Teams.

For displaying groups of people — like members of a team or attendees of a meeting — use `mgt-people`:

```html
<!-- Show people relevant to the current user -->
<mgt-people show-max="5" show-presence></mgt-people>

<!-- Show members of a specific group -->
<mgt-people group-id="YOUR_GROUP_ID"></mgt-people>
```

### mgt-agenda

This component renders upcoming calendar events. It's useful for dashboards, intranet homepages, or any app where users need to see what's coming up.

```html
<!-- Next 7 days of events -->
<mgt-agenda days="7"></mgt-agenda>

<!-- Events for a specific date range -->
<mgt-agenda
  group-by-day
  date="2026-04-13"
  days="14">
</mgt-agenda>
```

The `group-by-day` attribute adds date headers between events, which makes the output much more readable when showing multiple days.

You can also listen for user interaction:

```javascript
document.querySelector('mgt-agenda').addEventListener('eventClick', (e) => {
  const event = e.detail;
  console.log('User clicked:', event.subject);
  // Navigate to event details, open in Teams, etc.
});
```

### mgt-file-list

Surface OneDrive and SharePoint files directly in your app:

```html
<!-- Root of user's OneDrive -->
<mgt-file-list></mgt-file-list>

<!-- Specific folder -->
<mgt-file-list item-path="/Documents/Project Alpha"></mgt-file-list>

<!-- Files from a SharePoint drive -->
<mgt-file-list
  drive-id="YOUR_DRIVE_ID"
  item-path="/Shared Documents">
</mgt-file-list>
```

The component renders file icons, names, modification dates, and sizes. Users can click to open files in their respective Office web apps. You can customize which file metadata is displayed using the `fields` attribute.

### mgt-todo

Display and manage tasks from Microsoft To Do:

```html
<!-- All tasks from all lists -->
<mgt-todo></mgt-todo>

<!-- Tasks from a specific list -->
<mgt-todo list-id="YOUR_LIST_ID"></mgt-todo>
```

This component is interactive by default — users can check off tasks, add new ones, and set due dates directly from your app. If you want a read-only view, use CSS to hide the input elements, or use a custom template to render only the data you need.

## Custom Templates

The default rendering works for most scenarios, but you'll eventually need custom layouts. MGT uses a template system that lets you override how any component renders its data.

```html
<mgt-agenda days="3">
  <template data-type="event">
    <div class="custom-event">
      <h3>{{ event.subject }}</h3>
      <p>{{ event.start.dateTime | date: 'HH:mm' }} - {{ event.end.dateTime | date: 'HH:mm' }}</p>
      <p>{{ event.location.displayName }}</p>
      <div data-if="event.isOnlineMeeting">
        <a href="{{ event.onlineMeeting.joinUrl }}">Join Teams Meeting</a>
      </div>
    </div>
  </template>
  <template data-type="no-data">
    <p>No meetings scheduled — enjoy the focus time.</p>
  </template>
</mgt-agenda>
```

Templates use double-brace syntax for data binding and support `data-if` for conditional rendering. The `data-type` attribute determines which template to use: `event` for each item, `no-data` when the result set is empty, and `loading` for the loading state.

This is where MGT really shines. You get the data-fetching and authentication for free, but you control the presentation layer completely.

## Using MGT with React

If you're building a React app, install the React wrapper:

```bash
npm install @microsoft/mgt-react
```

Then import components as React components:

```tsx
import { Person, Agenda, FileList, Login } from '@microsoft/mgt-react';

function Dashboard() {
  return (
    <div className="dashboard">
      <header>
        <Login />
        <Person personQuery="me" view="twolines" showPresence />
      </header>

      <section className="calendar">
        <h2>Upcoming Meetings</h2>
        <Agenda days={7} groupByDay />
      </section>

      <section className="files">
        <h2>Recent Files</h2>
        <FileList itemPath="/Documents" pageSize={10} />
      </section>
    </div>
  );
}

export default Dashboard;
```

Props map directly to the HTML attributes — `person-query` becomes `personQuery`, `group-by-day` becomes `groupByDay`. Event handlers follow the React convention: `eventClick` becomes `onEventClick`.

For custom templates in React, use the `TemplateHelper`:

```tsx
import { Agenda } from '@microsoft/mgt-react';

function CustomAgenda() {
  return (
    <Agenda
      days={7}
      templateContext={{ customGreeting: 'Your schedule' }}
    >
      <template data-type="event">
        <div className="event-card">
          <span data-props="{{@click: handleEventClick}}">
            {'{{ event.subject }}'}
          </span>
        </div>
      </template>
    </Agenda>
  );
}
```

## Caching and Performance

MGT components cache Graph API responses in memory by default. This means navigating between pages in a single-page app won't trigger redundant API calls. You can configure the cache behavior globally:

```typescript
import { CacheService } from '@microsoft/mgt-element';

// Cache responses for 15 minutes (default is 5)
CacheService.config.defaultInvalidationPeriod = 900000;

// Disable caching entirely (useful for real-time dashboards)
CacheService.config.isEnabled = false;
```

For pages that display multiple MGT components, be mindful of Graph API throttling. Microsoft Graph enforces per-app and per-user rate limits. If you're rendering `mgt-person` for 50 users on a single page, MGT will batch those requests automatically — but you should still use `show-max` on `mgt-people` and `page-size` on `mgt-file-list` to keep request counts reasonable.

## Handling the Signed-Out State

One detail that trips up developers: MGT components render nothing when no user is signed in. Your app needs to handle this gracefully. Use the `mgt-login` component and listen for provider state changes:

```typescript
import { Providers, ProviderState } from '@microsoft/mgt-element';

Providers.onProviderUpdated(() => {
  const provider = Providers.globalProvider;
  if (provider.state === ProviderState.SignedIn) {
    document.getElementById('app-content').style.display = 'block';
    document.getElementById('login-prompt').style.display = 'none';
  } else {
    document.getElementById('app-content').style.display = 'none';
    document.getElementById('login-prompt').style.display = 'block';
  }
});
```

In React, the `@microsoft/mgt-react` package exports a `useIsSignedIn` hook that makes this cleaner:

```tsx
import { useIsSignedIn } from '@microsoft/mgt-react';

function App() {
  const [isSignedIn] = useIsSignedIn();

  if (!isSignedIn) {
    return <Login />;
  }

  return <Dashboard />;
}
```

## When to Use MGT vs. Raw Graph API

MGT is the right choice when you need to **display** Microsoft 365 data in a UI. It handles auth, data fetching, caching, error states, and rendering in a single component — that's a massive reduction in code.

Use the raw Graph API when you need to **write** data (creating events, uploading files, sending emails), when you need precise control over the request (specific `$select`, `$filter`, or `$expand` parameters), or when you're working in a backend/serverless context where there's no UI to render.

The good news is these approaches compose well. Use MGT components for display, and call Graph API directly for mutations. The MSAL2 provider you configured for MGT works with the Graph SDK too — you don't need separate auth for each approach.

## Getting Started Today

Here's the fastest path to a working prototype:

1. **Register an app** in Entra ID with the permissions listed above
2. **Create an HTML file** with the CDN loader and `mgt-msal2-provider`
3. **Drop in components** — start with `mgt-login` and `mgt-person`
4. **Add `mgt-agenda` and `mgt-file-list`** to build a simple dashboard
5. **Customize with templates** once the data is flowing correctly

The Microsoft Graph Toolkit playground at [mgt.dev](https://mgt.dev) lets you experiment with every component and see live code samples. It's the best way to explore what's possible before committing to an implementation approach.

MGT turns what used to be hundreds of lines of auth + fetch + render code into a single HTML tag. For any web app that touches Microsoft 365 data, it should be your default starting point.
