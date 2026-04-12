---
title: "SPFx and Fluent UI v9: Build Modern Web Parts with React Components v9"
slug: spfx-fluent-ui-v9-web-parts-migration-guide-2026
excerpt: "Learn how to use Fluent UI v9 (React Components) in SPFx web parts — from installation to theming, with practical migration tips from v8."
date: "2026-04-12T10:00:00.000Z"
displayDate: "April 12, 2026"
readTime: "8 min read"
category: "SPFx"
image: "/images/blog/spfx-fluent-ui-v9-web-parts-migration-guide-2026.png"
tags:
  - "SPFx"
  - "Fluent UI"
  - "React"
  - "TypeScript"
  - "SharePoint Online"
---

## Why Fluent UI v9 Matters for SPFx

If you have been building SPFx web parts for any length of time, you have been using Fluent UI v8 (formerly Office UI Fabric React). It shipped with the SPFx scaffolding, it matched the SharePoint look and feel, and it worked. So why change?

Microsoft has been shipping Fluent UI v9 — the `@fluentui/react-components` package — as the design system for Teams, Outlook, Loop, and the rest of Microsoft 365. The SharePoint modern UI itself is progressively adopting v9 tokens and components. SPFx 1.21 added official guidance for using v9 alongside v8, and SPFx 1.22 made it the recommended path for new projects.

The practical impact: if you stay on v8 only, your web parts will start looking dated as the host pages around them shift to v9 styling. Components that used to blend in will feel slightly off — different border radii, different hover states, different spacing. The mismatch is subtle today but will become obvious over the next year.

This guide walks you through adding Fluent UI v9 to an SPFx web part, handling the theming integration that makes your components respect SharePoint themes, and migrating common v8 patterns to their v9 equivalents.

## What Changed Between v8 and v9

Fluent UI v9 is not an incremental update — it is a rewrite. Understanding the key differences will save you hours of confusion.

| Aspect | Fluent UI v8 | Fluent UI v9 |
|---|---|---|
| **Package** | `@fluentui/react` | `@fluentui/react-components` |
| **Styling** | CSS-in-JS via `mergeStyles` | Griffel (atomic CSS-in-JS) |
| **Theming** | `ThemeProvider` + `ITheme` | `FluentProvider` + design tokens |
| **Tree-shaking** | Limited — large bundle impact | Fully tree-shakeable |
| **Component API** | Class-based, prop-heavy | Composable slots, hooks-first |
| **Icons** | `@fluentui/react-icons` (SVG set) | Same package, same icons |

The biggest shift is theming. In v8, you passed an `ITheme` object to a `ThemeProvider`. In v9, you wrap your component tree in a `FluentProvider` and pass a `theme` object built from design tokens. This matters for SPFx because SharePoint injects its own theme, and your web part needs to consume it.

## Setting Up Fluent UI v9 in an SPFx Project

Start with an existing SPFx web part project (1.21 or later). If you are scaffolding from scratch with SPFx 1.22+, the new CLI already sets up the Heft build pipeline — no Gulp required.

### Install the packages

```bash
npm install @fluentui/react-components @fluentui/react-icons
```

If you are running v8 and v9 side by side during migration (which you should — rip-and-replace is rarely practical), both packages coexist without conflict. They use different CSS scoping mechanisms so there are no style collisions.

### Create the FluentProvider wrapper

The `FluentProvider` is the v9 equivalent of v8's `ThemeProvider`. It does two things: injects the design tokens your components consume for colors, spacing, and typography, and sets the `dir` attribute for RTL support.

Create a wrapper component that bridges the SharePoint theme into v9:

```typescript
// src/components/FluentWrapper.tsx
import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Theme,
  BrandVariants,
  createLightTheme,
  createDarkTheme,
} from "@fluentui/react-components";

// SharePoint passes theme colors via the ThemeProvider context
// We map the primary color to a v9 brand ramp
function createSharePointTheme(primaryColor: string): Theme {
  // For production, generate a full brand ramp from your tenant's theme color
  // using the Fluent UI Theme Designer or the createBrandRamp utility
  return webLightTheme;
}

interface FluentWrapperProps {
  children: React.ReactNode;
  themeVariant?: any; // IReadonlyTheme from @microsoft/sp-component-base
}

export const FluentWrapper: React.FC<FluentWrapperProps> = ({
  children,
  themeVariant,
}) => {
  const theme = React.useMemo(() => {
    if (themeVariant?.isInverted) {
      return webDarkTheme;
    }
    return webLightTheme;
  }, [themeVariant]);

  return <FluentProvider theme={theme}>{children}</FluentProvider>;
};
```

### Wire it into your web part

In your web part's `render` method, wrap the root component:

```typescript
// src/webparts/myWebPart/MyWebPartWebPart.ts
import { FluentWrapper } from "../../components/FluentWrapper";

public render(): void {
  const element = React.createElement(
    FluentWrapper,
    { themeVariant: this._themeVariant },
    React.createElement(MyWebPartComponent, {
      // your props here
    })
  );
  ReactDom.render(element, this.domElement);
}
```

To get `this._themeVariant`, consume the `ThemeProvider` service in your web part class:

```typescript
import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme,
} from "@microsoft/sp-component-base";

private _themeVariant: IReadonlyTheme | undefined;

protected onInit(): Promise<void> {
  const themeProvider = this.context.serviceScope.consume(
    ThemeProvider.serviceKey
  );
  this._themeVariant = themeProvider.tryGetTheme();
  themeProvider.themeChangedEvent.add(
    this,
    this._handleThemeChanged
  );
  return super.onInit();
}

private _handleThemeChanged(args: ThemeChangedEventArgs): void {
  this._themeVariant = args.theme;
  this.render();
}
```

This pattern ensures your v9 components switch between light and dark themes when the SharePoint section background changes — something users setting up pages with colored sections will appreciate.

## Building a Component with v9

Let's build a practical example: a task list card that displays items from a SharePoint list. This shows off several v9 patterns.

```tsx
// src/components/TaskListCard.tsx
import * as React from "react";
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Badge,
  Button,
  makeStyles,
  tokens,
  Divider,
} from "@fluentui/react-components";
import {
  CheckmarkCircle24Regular,
  Circle24Regular,
  ArrowRight16Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  card: {
    maxWidth: "480px",
    width: "100%",
  },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
  },
  taskTitle: {
    flex: 1,
  },
});

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

interface TaskListCardProps {
  tasks: Task[];
  listTitle: string;
  onToggle: (id: number) => void;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({
  tasks,
  listTitle,
  onToggle,
}) => {
  const styles = useStyles();

  const priorityColor = (p: string) => {
    switch (p) {
      case "High": return "danger";
      case "Medium": return "warning";
      default: return "informative";
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold" size={400}>{listTitle}</Text>}
        action={
          <Button
            appearance="transparent"
            icon={<ArrowRight16Regular />}
            size="small"
          >
            View all
          </Button>
        }
      />
      <Divider />
      {tasks.map((task) => (
        <div key={task.id} className={styles.taskRow}>
          <Button
            appearance="transparent"
            icon={
              task.completed
                ? <CheckmarkCircle24Regular />
                : <Circle24Regular />
            }
            onClick={() => onToggle(task.id)}
          />
          <Text
            className={styles.taskTitle}
            strikethrough={task.completed}
          >
            {task.title}
          </Text>
          <Badge
            appearance="filled"
            color={priorityColor(task.priority)}
            size="small"
          >
            {task.priority}
          </Badge>
        </div>
      ))}
    </Card>
  );
};
```

A few things to notice in this code.

**`makeStyles` replaces `mergeStyles`.** The API looks similar but the output is different — Griffel generates atomic CSS classes, which means smaller bundles when you use the same tokens across components. You import `tokens` for spacing, colors, and typography values instead of referencing theme object properties.

**Slots replace render props.** The `CardHeader` component takes `header` and `action` as slot props — you pass JSX directly rather than using render callbacks. This pattern is consistent across all v9 components and makes the code more readable.

**`Badge` replaces `Label` for status indicators.** If you were using `Label` with custom styling in v8 to show status tags, `Badge` is the semantic replacement in v9.

## Migrating Common v8 Patterns

Here is a quick reference for the components you will migrate most often:

| v8 Component | v9 Replacement | Notes |
|---|---|---|
| `DefaultButton` | `Button appearance="secondary"` | Default appearance is now "secondary" |
| `PrimaryButton` | `Button appearance="primary"` | Same visual, different API |
| `IconButton` | `Button appearance="transparent" icon={...}` | Icons are now slot props |
| `TextField` | `Input` or `Field` + `Input` | `Field` adds label and validation |
| `Dropdown` | `Dropdown` + `Option` | Completely new API, not a drop-in |
| `DetailsList` | `DataGrid` | Preview in v9 — evaluate readiness |
| `Panel` | `Drawer` | Right-side panels become drawers |
| `Dialog` | `Dialog` | Similar concept, new slot-based API |
| `Spinner` | `Spinner` | API simplified, same visuals |
| `MessageBar` | `MessageBar` | New API, same purpose |

The biggest pain point is `DetailsList` → `DataGrid`. The v9 `DataGrid` has a fundamentally different API built around column definitions and row data rather than the v8 approach of columns plus `onRenderItemColumn`. If your web part has a heavy `DetailsList` implementation, migrate everything else first and tackle the grid last. In many cases, running the v8 `DetailsList` alongside v9 components during the transition is the pragmatic choice.

## Handling Bundle Size

One of the selling points of v9 is tree-shaking. In v8, importing a single component could pull in significant chunks of the library. In v9, each component is independently packaged.

Measure the impact:

```bash
npx webpack-bundle-analyzer dist/stats.json
```

If you are running both v8 and v9 during migration, expect your bundle to be temporarily larger. That is acceptable during the transition. Once you fully remove `@fluentui/react`, the v9-only bundle will typically be 20-30% smaller than the equivalent v8 bundle for the same set of components.

To keep things lean during the transition, import only what you use:

```typescript
// Good — tree-shakeable
import { Button } from "@fluentui/react-components";

// Bad — pulls in more than you need
import * as Fluent from "@fluentui/react-components";
```

## Gotchas and Tips

**CSS specificity conflicts.** If you have global CSS in your web part that targets Fluent UI class names, those selectors will break because v9 generates different class names. Use `makeStyles` for all styling in v9 components and avoid targeting internal Fluent class names.

**RTL support is automatic.** `FluentProvider` handles `dir` based on the SharePoint page's language. You do not need to write separate RTL styles if you use Griffel's logical properties (`paddingInlineStart` instead of `paddingLeft`).

**The v9 `Dropdown` is not a drop-in.** The v8 `Dropdown` took an `options` array prop. The v9 `Dropdown` uses `Option` child components, similar to a native `<select>`. Your data mapping code will need to change:

```tsx
// v8
<Dropdown options={items.map(i => ({ key: i.id, text: i.name }))} />

// v9
<Dropdown>
  {items.map(i => (
    <Option key={i.id} value={i.id.toString()}>
      {i.name}
    </Option>
  ))}
</Dropdown>
```

**Test in the SharePoint workbench and on real pages.** The local workbench does not inject SharePoint theme tokens, so your theme-dependent styling will look different. Always validate on a real SharePoint page with section backgrounds set to different colors to confirm your theming integration works.

## What to Do Next

Start with new web parts. If you are building a new SPFx web part today, use v9 from day one. The `FluentWrapper` pattern above gives you proper SharePoint theme integration without extra effort.

For existing web parts, migrate incrementally. Install v9 alongside v8, wrap your root component in `FluentProvider`, and convert one component at a time. The two libraries coexist cleanly, so there is no need for a big-bang rewrite.

Keep an eye on the [Fluent UI v9 component status page](https://react.fluentui.dev/) for components still in preview. The core set — Button, Input, Card, Dialog, Table, Menu — is stable and production-ready. DataGrid and a few others are still maturing, so check the status before depending on them in production web parts.
