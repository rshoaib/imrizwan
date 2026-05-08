---
title: "SPFx Form Customizer Extensions: Modern List Forms (2026)"
slug: spfx-form-customizer-extensions-modernize-sharepoint-list-forms-2026
excerpt: "Replace SharePoint's default new/edit/view forms with a custom React UI using SPFx Form Customizer extensions — practical 2026 guide with full code."
date: "2026-05-01T09:00:00.000Z"
displayDate: "May 1, 2026"
readTime: "13 min read"
category: "SPFx"
image: "/images/blog/spfx-form-customizer-extensions-modernize-sharepoint-list-forms-2026.png"
tags:
  - "SPFx"
  - "Form Customizer"
  - "SharePoint"
  - "extensions"
  - "TypeScript"
  - "React"
  - "SharePoint Online"
---

## Why Form Customizers Matter in 2026

The default new and edit forms in SharePoint lists work for 80% of cases — type a title, pick a date, save. They fall apart the moment a real business process needs them. Conditional fields, validation against another list, multi-step wizards, lookup search across millions of rows, calls to a downstream API on save — none of that fits in the default form panel.

Microsoft's answer is the **SPFx Form Customizer extension**, an extension type that lets you replace the new, edit, or view form for a specific list with your own React component. It runs inside the list panel (or full page), it gets the item context for free, and it can save back to SharePoint the same way any SPFx web part can.

If you have been delaying a customization because the list form was "almost good enough," this post walks you through building a Form Customizer from scratch — scaffold to deploy — using the SPFx 1.22 toolchain that became the default earlier this year. Full working code, the gotchas I have hit twice, and the deployment steps that the docs glide past.

## What Form Customizers Can and Cannot Do

A Form Customizer is **not** a generic page extension. It hooks specifically into three places in a SharePoint list:

| Form mode | When it triggers | Your job |
|---|---|---|
| `New` | User clicks **+ New** in the list | Render an empty form, validate, save the new item |
| `Edit` | User clicks **Edit** on a row | Render the form pre-filled, validate, save the changes |
| `View` | User opens an item to read | Render a read-only, formatted view of the item |

The customizer gets a `displayMode` property at runtime so a single component can handle all three modes. You decide what to render for each.

What it can do well: arbitrary React UI, arbitrary HTTP calls (Graph, REST, downstream APIs), conditional layouts, file uploads, tabbed wizards, integration with a Power Automate flow on save. What it cannot do: change the **list view** itself (that is the now-retired Field Customizer's territory — see the [SPFx Field Customizer Retirement note](https://www.voitanos.io/blog/sharepoint-framework-field-customizer-retirement/) — for that you now use [Microsoft Lists JSON formatting](/blog/microsoft-lists-json-formatting-complete-guide-2026)) and it cannot intercept inline editing in the list grid.

One subtlety that bit me in production: a Form Customizer **replaces** the default form, it does not augment it. The moment your customizer is associated with a list, the out-of-the-box form for that mode is gone. So if your component throws on render, users get a blank panel. Plan for failure modes.

## Scaffolding the Form Customizer Project

SPFx 1.22 ships with the new `@microsoft/sharepoint` CLI (the Yeoman generator is gone — if you have not migrated, see [Migrating from the Yeoman SPFx Generator to the New CLI](/blog/spfx-cli-migrate-yeoman-heft-2026)).

Create the project:

```bash
mkdir spfx-form-customizer-demo
cd spfx-form-customizer-demo
npx @microsoft/sharepoint init --solution-name spfx-form-customizer-demo --framework react
npx @microsoft/sharepoint add extension --type formCustomizer --name OrderApprovalForm
```

The CLI scaffolds a `src/extensions/orderApprovalForm/` folder with:

```
OrderApprovalFormCustomizer.manifest.json
OrderApprovalFormCustomizer.ts
components/
  OrderApprovalForm.tsx
  IOrderApprovalFormProps.ts
loc/
  en-us.js
  mystrings.d.ts
```

The `.ts` file is the bootstrap — it inherits from `BaseFormCustomizer` and wires the React component into the form panel. You almost never edit it beyond adjusting the property bag passed to React. The action is in `components/OrderApprovalForm.tsx`.

Open `OrderApprovalFormCustomizer.ts` and you will see something like this:

```ts
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseFormCustomizer,
  FormDisplayMode
} from '@microsoft/sp-listview-extensibility';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import OrderApprovalForm from './components/OrderApprovalForm';
import { IOrderApprovalFormProps } from './components/IOrderApprovalFormProps';

export interface IOrderApprovalFormCustomizerProperties {
  sampleText?: string;
}

const LOG_SOURCE: string = 'OrderApprovalFormCustomizer';

export default class OrderApprovalFormCustomizer
  extends BaseFormCustomizer<IOrderApprovalFormCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Activated OrderApprovalFormCustomizer');
    return Promise.resolve();
  }

  @override
  public render(): void {
    const formProps: IOrderApprovalFormProps = {
      context: this.context,
      displayMode: this.displayMode,
      onSave: this._onSave.bind(this),
      onClose: this._onClose.bind(this)
    };
    const element = React.createElement(OrderApprovalForm, formProps);
    ReactDOM.render(element, this.domElement);
  }

  @override
  public onDispose(): void {
    ReactDOM.unmountComponentAtNode(this.domElement);
  }

  private _onSave = (): void => {
    this.formSaved();
  };

  private _onClose = (): void => {
    this.formClosed();
  };
}
```

Two things to notice. First, `this.displayMode` (typed `FormDisplayMode`) is what tells the React component whether to render the New, Edit, or View variant. Second, `this.formSaved()` and `this.formClosed()` are the only ways to tell the SharePoint host panel that you are done — call them or the panel will hang open.

## Building the React UI

The component needs to behave differently for each `FormDisplayMode`. Here is a minimalist starting point that handles all three:

```tsx
import * as React from 'react';
import { FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import {
  Button,
  Field,
  Input,
  Textarea,
  Spinner,
  FluentProvider,
  webLightTheme
} from '@fluentui/react-components';

export interface IOrderApprovalFormProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

interface IOrder {
  Title: string;
  Vendor: string;
  Amount: number;
  Notes: string;
}

export default function OrderApprovalForm(
  props: IOrderApprovalFormProps
): JSX.Element {
  const [item, setItem] = React.useState<IOrder>({
    Title: '',
    Vendor: '',
    Amount: 0,
    Notes: ''
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const isReadOnly = props.displayMode === FormDisplayMode.Display;
  const isEdit = props.displayMode === FormDisplayMode.Edit;

  React.useEffect(() => {
    if (isEdit || isReadOnly) {
      void loadItem();
    }
  }, []);

  async function loadItem(): Promise<void> {
    const itemId = props.context.itemId;
    const listGuid = props.context.list.guid.toString();
    const url =
      `${props.context.pageContext.web.absoluteUrl}` +
      `/_api/web/lists(guid'${listGuid}')/items(${itemId})` +
      `?$select=Title,Vendor,Amount,Notes`;

    const res = await props.context.spHttpClient.get(
      url,
      // eslint-disable-next-line
      (window as any).SPHttpClient.configurations.v1
    );
    const data = await res.json();
    setItem({
      Title: data.Title ?? '',
      Vendor: data.Vendor ?? '',
      Amount: data.Amount ?? 0,
      Notes: data.Notes ?? ''
    });
  }

  async function handleSave(): Promise<void> {
    if (!item.Title.trim()) {
      setError('Title is required');
      return;
    }
    if (item.Amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    setError(undefined);
    setIsSaving(true);
    try {
      await saveItem();
      props.onSave();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ padding: 16, maxWidth: 480 }}>
        <h2>{titleFor(props.displayMode)}</h2>

        <Field label="Title" required={!isReadOnly}>
          <Input
            value={item.Title}
            disabled={isReadOnly}
            onChange={(_, d) => setItem({ ...item, Title: d.value })}
          />
        </Field>

        <Field label="Vendor">
          <Input
            value={item.Vendor}
            disabled={isReadOnly}
            onChange={(_, d) => setItem({ ...item, Vendor: d.value })}
          />
        </Field>

        <Field label="Amount (USD)" required={!isReadOnly}>
          <Input
            type="number"
            value={item.Amount.toString()}
            disabled={isReadOnly}
            onChange={(_, d) =>
              setItem({ ...item, Amount: Number(d.value) || 0 })
            }
          />
        </Field>

        <Field label="Notes">
          <Textarea
            value={item.Notes}
            disabled={isReadOnly}
            onChange={(_, d) => setItem({ ...item, Notes: d.value })}
          />
        </Field>

        {error && (
          <div style={{ color: '#a4262c', marginTop: 8 }}>{error}</div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {!isReadOnly && (
            <Button
              appearance="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Spinner size="tiny" /> : 'Save'}
            </Button>
          )}
          <Button onClick={props.onClose}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
        </div>
      </div>
    </FluentProvider>
  );
}

function titleFor(mode: FormDisplayMode): string {
  if (mode === FormDisplayMode.New) return 'New Order';
  if (mode === FormDisplayMode.Edit) return 'Edit Order';
  return 'View Order';
}
```

A few notes on this skeleton. The `FluentProvider` wrapper is important — Form Customizer panels do **not** inherit the host page's Fluent theme automatically, so without it your inputs render unstyled. (If you have not switched to Fluent UI v9 yet, the [Fluent UI v9 SPFx migration guide](/blog/spfx-fluent-ui-v9-web-parts-migration-guide-2026) covers the move from v8.) The `isReadOnly` flag drives the View mode — every input gets disabled and only a Close button shows. And `props.context.spHttpClient` is the framework-provided REST client — it carries the digest and auth headers for you, so prefer it over raw `fetch`.

## Wiring the Form to SharePoint Data

The save itself is a standard SharePoint REST POST or MERGE depending on display mode. Here is the production-shaped helper:

```ts
async function saveItem(): Promise<void> {
  const listGuid = props.context.list.guid.toString();
  const baseUrl = `${props.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${listGuid}')/items`;
  const isNew = props.displayMode === FormDisplayMode.New;

  const body = JSON.stringify({
    Title: item.Title,
    Vendor: item.Vendor,
    Amount: item.Amount,
    Notes: item.Notes
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json;odata=nometadata',
    'Accept': 'application/json;odata=nometadata'
  };

  if (isNew) {
    const res = await props.context.spHttpClient.post(
      baseUrl,
      // eslint-disable-next-line
      (window as any).SPHttpClient.configurations.v1,
      { headers, body }
    );
    if (!res.ok) throw new Error(`Create failed: ${res.statusText}`);
  } else {
    headers['IF-MATCH'] = '*';
    headers['X-HTTP-Method'] = 'MERGE';
    const url = `${baseUrl}(${props.context.itemId})`;
    const res = await props.context.spHttpClient.post(
      url,
      // eslint-disable-next-line
      (window as any).SPHttpClient.configurations.v1,
      { headers, body }
    );
    if (!res.ok) throw new Error(`Update failed: ${res.statusText}`);
  }
}
```

The pattern that catches people: SharePoint's REST API uses `POST` plus the `X-HTTP-Method: MERGE` header for partial updates, **not** `PATCH`. If you forget `IF-MATCH: *` you will get a 412 Precondition Failed on every edit. And `odata=nometadata` shrinks payloads dramatically — for a list with two dozen fields it can cut response size by 80% — so use it unless you specifically need the `__metadata` block.

If you would rather call the **Microsoft Graph** instead of the SharePoint REST API, you can — see the [Microsoft Graph API authentication patterns for SPFx](/blog/microsoft-graph-api-spfx-user-profiles-teams). Just remember that Graph adds an extra hop and a slight latency penalty for in-list operations.

## Validation and Custom Save Behavior

Real forms need real validation. Three patterns I lean on:

**1. Inline field validation.** Run on each `onChange` so the user sees errors as they type, not after they hit Save. Use `<Field validationState="error" validationMessage="...">` from Fluent UI v9 — it keeps your error UI consistent with the rest of M365.

**2. Cross-field rules.** "Amount > 10000 requires a Notes value." These run in `handleSave` before the network call, because they depend on multiple fields.

**3. Server-side checks.** "Vendor must exist in the Approved Vendors list." These require an extra request — make them async, debounce them on blur, and gate Save until the check resolves.

A common mistake is to fire a Power Automate flow from inside the form and then call `props.onSave()` immediately. The user thinks the order is fully processed, but the flow runs separately and may fail silently. If your downstream process is critical, **await the flow trigger response** (or at least the HTTP 202 acknowledgement) before closing the panel. If you cannot wait — the flow takes minutes — render a clear "Submitted, processing in the background" state instead of a generic success.

## Deploying and Associating the Customizer to Lists

Two steps that the official docs gloss over. First, **deploy the package**:

```bash
npm run package-solution -- --ship
```

Upload `sharepoint/solution/spfx-form-customizer-demo.sppkg` to the **tenant App Catalog**, click **Deploy**, and confirm the prompt about deploying tenant-wide. The bundle goes to your CDN automatically when `cdnEnabled: true` is set.

Second — and this is the part that confuses most people — **a Form Customizer does not auto-associate with any list**. Unlike an Application Customizer, which can be deployed tenant-wide and runs everywhere, a Form Customizer must be **explicitly linked** to a list's content type (or to the list itself) by setting three properties on the content type:

- `NewFormClientSideComponentId` — the customizer's component ID (from the manifest)
- `EditFormClientSideComponentId` — same ID for edit
- `DisplayFormClientSideComponentId` — same ID for view

You can set these via PnP PowerShell:

```powershell
Connect-PnPOnline -Url https://contoso.sharepoint.com/sites/orders -Interactive

$listTitle = "Orders"
$customizerId = "11111111-2222-3333-4444-555555555555"

$ct = Get-PnPContentType -List $listTitle | Where-Object { $_.Name -eq "Item" }
Set-PnPContentType -Identity $ct.Id `
  -List $listTitle `
  -NewFormClientSideComponentId $customizerId `
  -EditFormClientSideComponentId $customizerId `
  -DisplayFormClientSideComponentId $customizerId
```

If you maintain a fleet of sites, automate this — the [PnP PowerShell admin scripts guide](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026) shows how to wrap this in an idempotent provisioning script.

To **revert** a list to the default forms, set the three properties back to empty strings (`""`). I keep an "uninstall" PowerShell snippet next to the install one — it has saved me at least once during a botched rollout.

## Common Pitfalls

A handful of mistakes I see repeatedly, in rough order of how often they bite:

The **panel hangs open** after Save — you forgot to call `props.onSave()` (which calls `formSaved()` under the hood). The SharePoint host has no other signal that you are done. Same goes for `onClose` / `formClosed()`.

The **form renders blank** — usually because your component threw during initial render (often from a bad `useEffect` doing async work without a try/catch) and the panel showed an empty replacement. Open DevTools and look in the SharePoint console; SPFx wraps and logs these. If you see an unhandled rejection from your component, that is your culprit.

**Field schema names differ from display names** — `props.context.list.fields` exposes both. Always use the *internal* name in REST calls. A Vendor column shown as "Vendor Name" might internally be `Vendor_x0020_Name` or `OData_Vendor` depending on history. Never hardcode without verifying.

**Fluent UI styles look broken** — you forgot the `<FluentProvider>` wrapper. The form panel does not inherit page-level theming.

**The form works in the panel but not in full page** — SharePoint can route your customizer to a full page when invoked from Microsoft Lists. Test both surfaces; container width assumptions that work in the side panel often break in full page.

**Item permissions check fails** — the Form Customizer runs with the user's permissions, not elevated. If the user lacks `EditListItems` on the list, your save will 403. Catch and surface this clearly.

## FAQ

**Q: Can I use a Form Customizer on a Document Library?**
Yes, but only for the **metadata edit form** — the file upload step itself is owned by SharePoint and cannot be replaced. Practically: users upload via the standard dialog, then your customizer takes over the metadata panel.

**Q: Does a Form Customizer work on Microsoft Lists (the standalone app), or only inside SharePoint sites?**
Both. The Lists app is a different surface for the same underlying lists, and the Form Customizer association on the content type carries through. The full-page rendering is more common in Lists, so test there.

**Q: Can I show different forms to different user groups?**
Not at the customizer level — one customizer is associated with a content type. The pattern is to **branch inside your React component** based on `props.context.pageContext.user` (group memberships, email, etc.) and render conditionally. For deeply different forms, create multiple content types on the list and associate a different customizer with each.

**Q: How do I debug locally?**
Run `npm run serve` and open the list with `?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"YOUR-COMPONENT-ID":{"location":"ClientSideExtension.FormCustomizer.Edit","properties":{}}}` appended to the URL. Source maps light up in Chrome DevTools.

**Q: What happens if I uninstall the SPFx package while a list is associated?**
The list reverts to the default form for any user who hits it after the uninstall — the three `*ClientSideComponentId` properties on the content type still point at a missing customizer, but SharePoint falls back gracefully to the OOB form. Clean the IDs anyway, in your uninstall script, to keep the schema tidy.

**Q: Can a Form Customizer call Microsoft Graph?**
Yes. Use `props.context.aadHttpClientFactory.getClient(resource)` to get an authenticated client, then call Graph normally. You will need to declare the Graph permission scopes in `package-solution.json` and have a tenant admin approve them — Graph calls from any SPFx component go through the same approval flow.

## Where to Go From Here

Form Customizers are the right tool when the default list form is *almost* what you need but cannot get the last 20% there. They are **not** the right tool for greenfield apps with no relationship to a SharePoint list — for those, an SPFx web part on a modern page or a Microsoft Teams tab is a better fit.

If you are building out a broader SharePoint customization story, the next logical reads on this site are the [SPFx Application Customizer guide for global headers and footers](/blog/spfx-application-customizer-header-footer-sharepoint-2026), the [Microsoft Lists JSON formatting reference](/blog/microsoft-lists-json-formatting-complete-guide-2026) for everything *outside* the form panel, and the [Fluent UI v9 migration guide](/blog/spfx-fluent-ui-v9-web-parts-migration-guide-2026) so your form does not look five years out of date next to the rest of Microsoft 365.

The full code from this post — scaffolding, component, save helper, PnP install script, and uninstall script — is the cleanest starting point I know of for a production Form Customizer in 2026. Lift it, rename the fields, and you will save yourself a couple of days.
