export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  displayDate: string
  readTime: string
  category: 'SPFx' | 'Power Platform' | 'SharePoint' | 'Microsoft 365'
  image?: string
  tags?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: "2",
    slug: "enterprise-governance-sharepoint-ai-developer-checklist",
    title: "Enterprise Governance for SharePoint-Powered AI: A Developer's Checklist (2026)",
    excerpt: "Copilot doesn't fix bad governance — it amplifies it. Here's the hands-on developer checklist with PowerShell scripts, SAM configuration, and sensitivity label implementation to make your SharePoint tenant AI-ready.",
    date: "2026-03-22T00:00:00.000Z",
    displayDate: "March 22, 2026",
    readTime: "12 min read",
    category: "Microsoft 365",
    image: "/images/blog/enterprise-governance-ai-sharepoint.png",
    tags: ["Copilot", "Governance", "SharePoint", "AI", "PowerShell", "2026"],
    content: `## Why Governance Matters More Now Than Ever

If your SharePoint environment is messy today, **Microsoft Copilot will make it messier tomorrow**. Copilot respects your existing permissions model. It does not create new security boundaries — it inherits whatever access a user already has. That means every overshared site, every "Everyone" permission, and every orphaned Team becomes a potential data leak vector the moment you flip Copilot on.

This isn't a CIO-level strategy document. This is a **developer's field guide** — the scripts, commands, and configurations you need to run *before* your tenant goes live with Copilot.

---

## The Pre-Copilot vs. Post-Copilot Shift

Most governance guides were written for a world without AI. Here's what changes:

| Area | Pre-Copilot Governance | Post-Copilot Governance |
|------|----------------------|------------------------|
| **Permissions** | "Fix it if someone complains" | Must be proactively audited — Copilot surfaces everything a user can access |
| **Content Lifecycle** | Archive when storage runs out | Must enforce retention — stale content pollutes Copilot responses |
| **Sensitivity Labels** | "Nice to have" for compliance | **Mandatory** — Copilot skips unlabeled encrypted files entirely |
| **Site Ownership** | Informal ("ask Bob") | Must be defined — ownerless sites become unmanaged AI data sources |
| **External Sharing** | Per-request basis | Must be policy-driven — Copilot can surface externally shared content to internal users |

**Key takeaway:** Governance is no longer a compliance checkbox. It's the quality control layer for your AI's output.

---

## Checklist Part 1: Permissions Audit

Before Copilot touches your tenant, you need to know **who has access to what**. The biggest risk is oversharing — sites where "Everyone except external users" has read access.

### Script: Find Overshared Sites

Use [PnP PowerShell](/blog/pnp-powershell-sharepoint-scripts) to scan your tenant for sites with broad access:

\`\`\`powershell
# Connect to SharePoint Online Admin
Connect-PnPOnline -Url "https://contoso-admin.sharepoint.com" -Interactive

# Get all site collections
$sites = Get-PnPTenantSite -Detailed

foreach ($site in $sites) {
    Connect-PnPOnline -Url $site.Url -Interactive
    $web = Get-PnPWeb -Includes RoleAssignments

    foreach ($ra in $web.RoleAssignments) {
        $member = $ra.Member
        if ($member.LoginName -match "everyone" -or 
            $member.LoginName -match "nt authority") {
            Write-Warning "[OVERSHARED] $($site.Url) — $($member.Title)"
        }
    }
}
\`\`\`

### Script: Remove "Everyone" from the People Picker

This is the single most impactful change you can make. It prevents users from accidentally sharing with the entire organization:

\`\`\`powershell
# Disable "Everyone except external users" in People Picker
Set-PnPTenant -ShowEveryoneExceptExternalUsersClaim $false

# Verify the change
Get-PnPTenant | Select ShowEveryoneExceptExternalUsersClaim
\`\`\`

> **Pro Tip:** After running this, existing permissions are NOT removed. You still need to clean up sites that already have "Everyone" access using the audit script above.

### Implementing Least Privilege

The principle is simple: **users should only access what they need for their role**. In practice, this means:

1. **Use Security Groups**, not individual sharing
2. **Default to "Members" (Edit)** — avoid giving "Full Control" to non-owners
3. **Review Sharing Links quarterly** — use the [SharePoint permissions model](/blog/sharepoint-permissions-explained) to understand inheritance

---

## Checklist Part 2: Content Lifecycle Management

Copilot indexes everything a user can see. If your tenant has 5 years of outdated project documents, Copilot will confidently cite them as current information.

### Script: Find Inactive Sites (No Activity in 90+ Days)

\`\`\`powershell
$threshold = (Get-Date).AddDays(-90)
$inactiveSites = @()

$sites = Get-PnPTenantSite -Detailed

foreach ($site in $sites) {
    if ($site.LastContentModifiedDate -lt $threshold) {
        $inactiveSites += [PSCustomObject]@{
            Url             = $site.Url
            Title           = $site.Title
            Owner           = $site.Owner
            LastModified    = $site.LastContentModifiedDate
            StorageMB       = [math]::Round($site.StorageUsageCurrent, 2)
        }
    }
}

# Export report
$inactiveSites | 
    Sort-Object LastModified | 
    Export-Csv -Path "InactiveSites.csv" -NoTypeInformation

Write-Host "Found $($inactiveSites.Count) inactive sites" -ForegroundColor Yellow
\`\`\`

### Action Plan for Inactive Sites

| Site Age (Inactive) | Recommended Action |
|---------------------|-------------------|
| 90–180 days | Email owner → confirm if still needed |
| 180–365 days | Set to **Read-Only** via SAM policy |
| 365+ days | **Archive** to cold storage or delete |

### Using SharePoint Advanced Management (SAM)

SAM is included with Copilot licenses and provides enterprise-grade lifecycle controls:

1. **Inactive Site Policy**: Automatically detect and notify owners of dormant sites
2. **Restricted Access Control (RAC)**: Limit site access to specific security groups only
3. **Restricted Content Discoverability (RCD)**: Hide site content from Copilot and Microsoft Search results without changing permissions

Configure RAC via PowerShell:

\`\`\`powershell
# Restrict a sensitive site to a specific group only
Set-SPOSite -Identity "https://contoso.sharepoint.com/sites/HR-Confidential" \`
    -RestrictedAccessControl $true \`
    -RestrictedAccessControlGroups "HR-Team@contoso.com"
\`\`\`

---

## Checklist Part 3: Sensitivity Labels & Classification

Sensitivity labels are the mechanism that tells Copilot **what it can and cannot do** with a piece of content. Without labels, Copilot treats all content equally — which is dangerous for confidential data.

### The Label Hierarchy

Design your labels in tiers. Here's a proven enterprise pattern:

| Label | Encryption | Copilot Behavior | Use Case |
|-------|-----------|-------------------|----------|
| **Public** | None | Full access | Marketing materials, published docs |
| **Internal** | None | Full access (internal users only) | Project plans, meeting notes |
| **Confidential** | AES-256 | Access if user has rights + label enabled in SP | HR docs, financial reports |
| **Highly Confidential** | AES-256 + DLP | **Blocked from Copilot** unless explicitly enabled | M&A documents, legal contracts |

### Enabling Sensitivity Labels for Copilot

By default, Copilot **cannot process encrypted files**. You must explicitly enable this in the Microsoft Purview compliance portal:

1. Navigate to **Microsoft Purview** → **Information Protection** → **Labels**
2. Edit each label → **Encryption** tab
3. Enable **"Allow Copilot to process content with this label"**
4. **Critical**: Only enable this for labels where AI processing is appropriate (Public, Internal, Confidential). Keep "Highly Confidential" blocked.

### Script: Audit Unlabeled Content

\`\`\`powershell
# Find files without sensitivity labels in a target site
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/Finance" -Interactive

$items = Get-PnPListItem -List "Documents" -PageSize 500

$unlabeled = $items | Where-Object { 
    $_["_ComplianceTag"] -eq $null -and
    $_["FileLeafRef"] -match "\\.(docx|xlsx|pptx|pdf)$"
}

Write-Host "Unlabeled files: $($unlabeled.Count) / $($items.Count) total"
$unlabeled | Select-Object @{N='File';E={$_["FileLeafRef"]}}, 
    @{N='Modified';E={$_["Modified"]}} | Format-Table
\`\`\`

---

## Checklist Part 4: Agent & Copilot Studio Governance

With [SharePoint Agents and Copilot Studio](/blog/sharepoint-agents-copilot-studio), developers can now build custom AI agents grounded in SharePoint content. This creates a new governance surface.

### Key Controls

1. **Restrict agent creation** to approved developers using Copilot Studio DLP policies
2. **Use \`Sites.Selected\`** instead of \`Sites.Read.All\` for Graph API permissions — this scopes agent access to specific SharePoint sites only
3. **Audit agent activity** via the Microsoft 365 unified audit log:

\`\`\`powershell
# Search for Copilot/Agent interactions in audit log
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-7) \`
    -EndDate (Get-Date) \`
    -RecordType "CopilotInteraction" \`
    -ResultSize 100 |
    Select-Object CreationDate, UserIds, Operations |
    Format-Table -AutoSize
\`\`\`

4. **Define deployment zones**: Personal (user experiments) → Departmental (team-scoped) → Enterprise (org-wide, approved only)

---

## Checklist Part 5: Monitoring & Continuous Improvement

Governance is not a one-time project. It's a continuous loop.

### The Governance Feedback Loop

1. **Weekly**: Review Copilot usage reports in the M365 Admin Center
2. **Monthly**: Run permission audit scripts → fix oversharing
3. **Quarterly**: Review inactive sites → archive or delete
4. **Annually**: Reassess sensitivity label hierarchy → align with new business units

### Key Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Sites with "Everyone" access | **0** | PnP PowerShell audit script |
| Unlabeled files in sensitive sites | **< 5%** | Purview Content Explorer |
| Inactive sites (90+ days) | **< 10%** of total | SAM Inactive Site Policy |
| Copilot interactions flagged | **< 1%** | Unified Audit Log |

---

## Quick-Start Summary

Here's the prioritized order of operations — tackle these in your first sprint:

| Priority | Action | Time Estimate |
|----------|--------|---------------|
| 🔴 1 | Disable "Everyone" in People Picker | 5 minutes |
| 🔴 2 | Run overshared sites audit | 30 minutes |
| 🔴 3 | Enable sensitivity labels for Copilot | 1 hour |
| 🟠 4 | Configure SAM inactive site policy | 2 hours |
| 🟠 5 | Scope agent permissions to Sites.Selected | 1 hour |
| 🟡 6 | Set up quarterly review cadence | 30 minutes |

---

## FAQ

### Does Copilot bypass SharePoint permissions?
**No.** Copilot strictly respects the existing Microsoft 365 permission model. It can only access content that the signed-in user already has access to. The risk is not that Copilot bypasses security — it's that **existing oversharing becomes more visible** because Copilot actively surfaces content users didn't know they could access.

### Do I need SharePoint Advanced Management (SAM) for Copilot governance?
SAM is not strictly required, but it's **strongly recommended**. SAM provides Restricted Access Control (RAC), Restricted Content Discoverability (RCD), and inactive site policies that are critical for enterprise-scale governance. SAM licenses are typically included with Microsoft 365 Copilot licenses.

### What happens to files without sensitivity labels when Copilot is enabled?
Unlabeled files are treated as accessible to anyone with existing permissions. **Encrypted files without Copilot-enabled labels are skipped entirely** — Copilot cannot process them. This means important encrypted content may silently disappear from Copilot results unless you explicitly enable processing.

### How do I prevent Copilot from surfacing outdated content?
Implement a content lifecycle policy: use the inactive sites audit script to identify stale content, set retention labels via Microsoft Purview, and configure SAM's Restricted Content Discoverability (RCD) to exclude archived sites from Copilot and Search results.

### Can I control which SharePoint sites Copilot Agents can access?
Yes. Use **Resource-Specific Consent (RSC)** and the \`Sites.Selected\` Graph permission instead of \`Sites.Read.All\`. This scopes each agent to only the SharePoint sites it explicitly needs, following the principle of least privilege.`
  },
  {
    id: "1",
    slug: "sharepoint-2013-workflows-power-automate-migration",
    title: "SharePoint 2013 Workflows to Power Automate Migration Guide (2026)",
    excerpt: "With the final April 2026 deadline approaching, learn the step-by-step developer approach to migrating legacy SharePoint 2013 Workflows to Power Automate. Covers the M365 Assessment Tool, logic rebuilding, and interactive automation tools.",
    date: new Date().toISOString(),
    displayDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: "8 min read",
    category: "Power Platform",
    image: "/images/blog/sharepoint-2013-workflows-migration.png",
    tags: ["Power Automate", "SharePoint", "Migration", "2026"],
    content: `## The April 2026 Deadline: Are You Ready?

Microsoft has drawn a firm line in the sand: **SharePoint 2013 workflows will be completely retired for existing tenants by April 2, 2026**. (They were already disabled for new tenants in April 2024).

If your organization still relies on legacy SharePoint Designer workflows for critical business processes—like document approvals, list item updates, or notification routing—the clock is ticking. You must transition to Power Automate. But migrating isn't just a simple copy-paste operation; it requires a strategic shift in how you build and structure your logic.

In this guide, I'll walk you through a pragmatic, developer-focused approach to moving away from SharePoint 2013 workflows safely and efficiently.

---

## 1. Assessment: The Microsoft 365 Assessment Tool

Before writing a single line of a new flow or dropping an action into the visual designer, you need a complete picture of your environment. Do not rely on manual audits or "institutional knowledge."

Instead, use the **Microsoft 365 Assessment Tool**.

### Why the Assessment Tool is Mandatory
This official scanner connects to your tenant and generates a Power BI report detailing every active workflow, its usage frequency, its association (Lists vs. Content Types), and, crucially, an "upgradability score." This score indicates how seamlessly a workflow translates to Power Automate.

**Pro-Tip:** Focus first on workflows with high execution counts and high upgradability scores. These "quick wins" build momentum with your stakeholders.

---

## 2. Re-engineering vs. 1:1 Migration

The biggest mistake developers make is trying to migrate a SharePoint Designer workflow 1:1 into Power Automate. Power Automate is structurally fundamentally different. 

**SharePoint workflows are state machines.** They wait for changes gracefully over months. 
**Power Automate flows are stateless execution engines.** They have a strict 30-day run limit.

### Structural Differences

| Feature | SharePoint 2013 Workflows | Power Automate |
|---------|---------------------------|----------------|
| **Architecture** | State Machine (Event-driven) | Stateless (Trigger-based) |
| **Max Run Duration** | Indefinite | 30 Days (Hard limit) |
| **Approvals** | Task Lists (cumbersome) | Native Approvals Connector |
| **Integrations** | Limited (Mostly internal) | 1,000+ Premium Connectors |

Because of the 30-day timeout, **never build a single flow that waits for a multi-stage approval that could take weeks**. Instead, break the process into smaller, independent flows triggered by status column updates in your SharePoint List.

---

## 3. Rebuilding the Logic: Essential Tools

Power Automate provides a powerful web-based designer, but writing complex formulas and organizing your outputs can get messy quickly. Unlike SharePoint Designer's simplistic UI, Power Automate requires you to use **Expressions** (which behave similarly to Excel formulas) to reshape data.

### Tool 1: Mastering Expressions
If you've struggled with expressions like \`formatDateTime()\` or \`coalesce()\`, you need a reliable quick reference. I've built a free interactive [Power Automate Expressions directory](/tools/power-automate-expressions) that lets you search and copy exact syntax, with real-world examples. It's an indispensable companion when you're deeply nested inside an "Apply to Each" loop.

### Tool 2: The Action Outputs (Formatting HTML)
One of the most common tasks in a legacy workflow is generating a summary email containing a table of line items. In Power Automate, you use the **Create HTML table** action.

By default, the output is exceptionally ugly—just raw, unstyled HTML. To make your automated emails look professional and enterprise-grade, use my [HTML Table Styler tool](/tools/html-table-styler). You can visually design your table (colors, padding, borders) and it instantly generates the exact CSS block to inject before your table output.

---

## 4. Addressing Workflow History and Approvals

### The Loss of Workflow History
A major shock for users migrating from SharePoint 2013 is the absence of the classic "Workflow History" list. Power Automate maintains a 30-day run history, which is not easily accessible to end-users and disappears quickly.

**The Fix:** Create a dedicated "Audit Log" SharePoint list. In your flow, explicitly add "Create Item" actions at key milestones to log statuses, approver comments, and timestamps to this list. This provides a permanent, searchable record.

### Modernizing Approvals
Abandon the old logic of creating tasks in a SharePoint list. Power Automate's native "Start and wait for an approval" action pushes interactive Adaptive Cards directly to Microsoft Teams and Outlook. Approvers can click "Approve" or "Reject" without ever opening SharePoint. It is the single biggest "wow" factor you can deliver during this migration.

---

## Conclusion & Next Steps

The April 2026 deprecation of SharePoint 2013 workflows is a hard deadline, but it is also an opportunity to completely modernize your enterprise processes. By leveraging tools like the M365 Assessment Tool, breaking complex state machines into modular flows, and utilizing deep resources like the [Power Automate Expressions directory](/tools/power-automate-expressions), you can make the transition flawless.

Start scanning your tenant today. 2026 will come faster than you think.
`
  }
];
