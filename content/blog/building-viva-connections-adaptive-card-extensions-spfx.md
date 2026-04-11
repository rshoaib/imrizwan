---
title: "Building Viva Connections Adaptive Card Extensions (ACEs)"
slug: building-viva-connections-adaptive-card-extensions-spfx
excerpt: "Build interactive Viva Connections dashboard widgets with SPFx adaptive cards — no dedicated API needed."
date: "2026-03-02"
displayDate: "March 2, 2026"
readTime: "14 min read"
image: "/images/blog/viva-connections-ace-guide.png"
category: "SPFx"
tags:
  - "spfx"
  - "viva-connections"
  - "adaptive-card-extensions"
  - "ace"
  - "microsoft-365"
  - "dashboard"
---

## What Are Adaptive Card Extensions?

**Adaptive Card Extensions (ACEs)** are the building blocks of the **Microsoft Viva Connections** dashboard — the employee experience hub in Microsoft 365. Every card on the Viva Connections dashboard is an ACE.

As an SPFx developer, ACEs let you build compact, interactive dashboard widgets that surface real-time business data directly on the Viva Connections home screen. Think of them as SPFx web parts, but purpose-built for mobile-first, glanceable dashboards.

An ACE has two visual states:

- **Card View** — The compact card shown on the dashboard (like a widget on your phone home screen)
- **Quick View** — A richer, larger panel that opens when the user clicks the card (like tapping a widget to expand it)

Both are rendered using **Adaptive Card JSON** — the same cross-platform card format used in Teams, Outlook, and Bot Framework.

## Why Build ACEs in 2026?

With Viva Connections rolling out as the default Teams home experience for many enterprise organizations, the Viva dashboard is now the first screen employees see every day. This makes ACEs one of the highest-visibility touchpoints in the entire Microsoft 365 ecosystem.

Real-world ACE use cases that are trending right now:

- **IT Service Desk** — Show open ticket count, let users submit new tickets
- **Leave Balance Tracker** — Display remaining leave days, link to the request form
- **Company News Feed** — Surface the latest announcements from SharePoint News
- **Attendance Summary** — Show today's in-office vs. remote headcount
- **Project Status Tracker** — At-a-glance KPIs for active projects from Planner or Dataverse
- **Birthday & Anniversary Cards** — Celebrate team milestones pulled from HR data

## Prerequisites

Set up your environment before starting:

- **SPFx 1.19+** (ACE improvements require at minimum 1.18; 1.21+ recommended for latest ACE features)
- **Node.js 18.x LTS** — use `nvm` to manage versions
- **Yeoman + SPFx generator** (or the new `@microsoft/spfx-cli` for SPFx 1.23+)
- **Microsoft 365 developer tenant** with Viva Connections enabled
- **Viva Connections license** — included in Microsoft 365 E3/E5, or available as standalone

Verify your environment:

```bash
node --version   # Should be 18.x
npm --version    # Should be 9.x or higher
yo --version     # Should be installed globally
```

## Step 1: Scaffold Your First ACE

Create a new project using the SPFx generator:

```bash
yo @microsoft/sharepoint
```

When prompted:

1. **Solution name:** `leave-balance-ace`
2. **Target:** SharePoint Online only (latest)
3. **Place files:** Current folder
4. **Type of client-side component:** Adaptive Card Extension
5. **Template:** Generic Card Template
6. **ACE name:** `LeaveBalanceACE`

## Step 2: Understand the ACE Architecture

The main ACE class extends `BaseAdaptiveCardExtension` and has two key methods:

- **`onInit()`** — Called when the ACE loads. Fetch your data here and set initial state
- **`setState()`** — Updates state and triggers re-render of both card and quick views
- **`renderCard()`** — Returns the ID of the card view to display
- **`cardNavigator` / `quickViewNavigator`** — Navigation stacks for view routing

## Step 3: Build the Card View

The card view defines what users see on the dashboard. Use `BasePrimaryTextCardView` for most cases:

```typescript
export class CardView extends BasePrimaryTextCardView<Props, State> {
  public get data(): IPrimaryTextCardViewParameters {
    return {
      title: this.properties.title || 'Leave Balance',
      primaryText: `${this.state.annualLeaveRemaining} days`,
      description: `Annual leave remaining · Updated ${this.state.lastUpdated}`,
    };
  }

  public get cardButtons() {
    return [{
      title: 'View Details',
      action: { type: 'QuickView', parameters: { view: QUICK_VIEW_REGISTRY_ID } },
    }];
  }
}
```

### Built-in Card View Templates

| Class | When to Use |
|-------|------------|
| `BasePrimaryTextCardView` | Title + primary text + description |
| `BaseImageCardView` | Card with a featured image |
| `BaseTextInputCardView` | Card with an inline text input |
| `BaseBasicCardView` | Minimal card — just title and buttons |

## Step 4: Build the Quick View

The Quick View is a full Adaptive Card that opens when users click your card:

```typescript
export class QuickView extends BaseAdaptiveCardView<Props, State, Data> {
  public get data() {
    return {
      annualLeave: this.state.annualLeaveRemaining,
      sickLeave: this.state.sickLeaveRemaining,
      lastUpdated: this.state.lastUpdated,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return {
      "type": "AdaptiveCard",
      "version": "1.5",
      "body": [
        { "type": "TextBlock", "text": "Your Leave Balance", "size": "Large", "weight": "Bolder" },
        {
          "type": "FactSet",
          "facts": [
            { "title": "Annual Leave", "value": "${annualLeave} days remaining" },
            { "title": "Sick Leave", "value": "${sickLeave} days remaining" },
            { "title": "Last Updated", "value": "${lastUpdated}" }
          ]
        }
      ]
    };
  }
}
```

You can design Adaptive Cards at [adaptivecards.io/designer](https://adaptivecards.io/designer/) before embedding them.

## Step 5: Test in the Workbench

```bash
gulp serve
```

This opens the Viva Connections workbench. For testing against real SharePoint data, use the hosted workbench at `https://YOUR_TENANT.sharepoint.com/_layouts/15/workbench.aspx`.

## Step 6: Add a Property Pane

Let administrators configure the ACE without code changes:

```typescript
export class LeaveBalancePropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        groups: [{
          groupFields: [
            PropertyPaneTextField('title', { label: 'Card Title' }),
            PropertyPaneTextField('listName', { label: 'SharePoint List Name' }),
          ],
        }],
      }],
    };
  }
}
```

## Step 7: Deploy to Viva Connections

Build and package:

```bash
gulp bundle --ship
gulp package-solution --ship
```

**Deploy to App Catalog:**
1. Go to **SharePoint Admin Center** → **Advanced** → **App catalog**
2. Upload your `.sppkg` → click **Deploy** → check **Make this solution available to all sites**

**Add to Viva Connections Dashboard:**
1. Open Viva Connections in Teams → click **Edit**
2. Click **Add a card** → find your ACE → configure → **Save** and **Publish**

## Advanced: Real-time State Updates

ACEs support periodic background data refreshes:

```typescript
setInterval(async () => {
  await this._fetchLeaveData();
}, 5 * 60 * 1000); // Refresh every 5 minutes
```

## Advanced: Deep-Linking to Teams

```typescript
public get cardButtons(): [ICardButton] {
  return [{
    title: 'Open in Teams',
    action: {
      type: 'ExternalLink',
      parameters: { isTeamsDeepLink: true, target: 'https://teams.microsoft.com/l/channel/...' },
    },
  }];
}
```

## Common ACE Patterns

### Loading State Pattern

Always show a loading state while data fetches:

```typescript
public async onInit(): Promise<void> {
  this.state = { isLoading: true, data: null };
  try {
    const data = await this._fetchData();
    this.setState({ isLoading: false, data });
  } catch (error) {
    this.setState({ isLoading: false, error: 'Failed to load data' });
  }
}
```

### Multi-View Navigation

```typescript
// Navigate to next view
this.quickViewNavigator.push(CONFIRM_VIEW_ID);
// Navigate back
this.quickViewNavigator.pop();
// Reset to card view
this.quickViewNavigator.close();
```

## Performance Tips

- **Cache API responses.** Store fetched data in state and only re-fetch on explicit refresh
- **Use Adaptive Card v1.5.** It supports more features and renders better on mobile
- **Keep card view minimal.** Show 2-3 key numbers maximum — the quick view is for details
- **Test on mobile.** Viva Connections is heavily used on Teams mobile
- **Handle 403 errors gracefully.** Show a friendly fallback message instead of a broken card

## What's Coming for ACEs in SPFx 1.24

- **ACE actions without Quick View** — Trigger Power Automate flows directly from card buttons
- **Image Card View improvements** — Animated images and richer layout options
- **Enhanced mobile gestures** — Swipe actions on cards for quick approvals
- **AI-generated card content** — Integration point for Copilot-generated summaries in ACE card views

Viva Connections ACEs are the most direct way for SPFx developers to impact the daily experience of every employee in an organization. With mobile-first usage growing and Viva becoming the default Teams home page, the investment in learning ACEs pays dividends quickly.
