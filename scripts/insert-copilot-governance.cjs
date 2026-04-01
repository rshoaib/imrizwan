const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

const CONTENT = `
Microsoft Copilot is now integrated deeply into SharePoint, Teams, Outlook, and the entire Microsoft 365 stack. But before you flip the switch for your organization, there's a governance question that most IT leaders are ignoring: **what happens when AI can access everything your employees can?**

Copilot doesn't create new security holes — it exposes existing ones. If your SharePoint permissions are a mess (and let's be honest, most are), Copilot will surface sensitive documents in employee prompts that were technically accessible but practically invisible before.

This guide covers the governance framework every Microsoft 365 administrator should implement before — or immediately after — deploying Copilot across the organization.

## Why Governance Matters for Copilot

Traditional SharePoint governance focused on organization: naming conventions, metadata, retention policies. Copilot governance is fundamentally different because it's about **what AI can see and surface**.

Consider this scenario: A junior employee asks Copilot, "What was the executive team's decision on the layoffs?" If the HR SharePoint site has overly broad permissions (read: nearly every organization), Copilot might surface that confidential document in its response.

The AI doesn't hack anything. It uses the employee's existing permissions. But it makes discovery automatic and effortless — which changes the risk calculus entirely.

### The Core Principle

> **Copilot governance = Permission governance + Data classification + Usage monitoring**

If any one of those three pillars is weak, your Copilot deployment is a liability.

## The 8 Governance Controls You Need

### 1. Permission Audit Before Deployment

Before enabling Copilot, audit your SharePoint permissions across every site, library, and folder. You're looking for:

- **Overly broad access**: Sites where "Everyone" or "Everyone except external users" has read access
- **Stale permissions**: Ex-employees or transferred staff who still have access to sensitive sites
- **Broken inheritance**: Folders with unique permissions that don't match their parent site
- **Guest access leakage**: External users with access to internal collaboration sites

**Tool**: Use the SharePoint admin center's "Sharing and access" reports, or run the PnP PowerShell audit:

\`\`\`powershell
# Get all sites with broad permissions
Get-PnPTenantSite | ForEach-Object {
    Connect-PnPOnline -Url $_.Url -Interactive
    $groups = Get-PnPGroup | Where-Object { $_.Title -like "*Everyone*" }
    if ($groups) {
        Write-Host "$($_.Url) - Has 'Everyone' group with access" -ForegroundColor Red
    }
}
\`\`\`

### 2. Sensitivity Labels (Microsoft Purview)

Apply Microsoft Purview sensitivity labels to classify documents:

| Label | Access Scope | Copilot Behavior |
|-------|-------------|-----------------|
| **Public** | Everyone | Copilot can reference freely |
| **General** | All employees | Copilot can reference for employees |
| **Confidential** | Specific groups | Copilot only surfaces for group members |
| **Highly Confidential** | Named individuals | Copilot excludes from general responses |

When a document is labeled "Highly Confidential," Copilot respects the label boundaries. But only if the labels are actually applied. Manual labeling has poor adoption — configure auto-labeling policies in Purview to catch sensitive content patterns (SSNs, financial data, legal terms).

### 3. Restricted SharePoint Sites (Site-Level Exclusion)

For the most sensitive content, use **Restricted SharePoint Search (RSS)** to exclude entire sites from Copilot's index:

\`\`\`powershell
# Exclude a site from Microsoft 365 Copilot
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/ExecutiveStrategy \\
  -RestrictedSearchEnabled $true
\`\`\`

Use this for:
- Executive strategy sites
- HR confidential (compensation, performance reviews, legal)
- M&A/deal rooms
- Board of directors sites

### 4. Data Loss Prevention (DLP) Policies

Configure DLP policies in Microsoft Purview to prevent Copilot from surfacing specific data types:

- Credit card numbers
- Social Security Numbers
- Employee IDs and salary data
- Attorney-client privileged communications

DLP policies block Copilot from including matched content in responses, even if the user technically has access.

### 5. Retention and Lifecycle Management

Old content is the biggest governance risk. Documents from 2019 with outdated org charts, deprecated policies, and stale project plans are still visible to Copilot. If an employee asks "What is our company's remote work policy?" Copilot might surface a 2020 COVID-era policy instead of the 2026 update.

**Actions:**
- Implement retention policies to auto-delete content after defined periods
- Archive completed projects into a restricted site
- Use content expiration dates on policy documents

### 6. Copilot Usage Monitoring

Track how employees use Copilot to identify governance gaps:

- **Microsoft 365 admin center** → Reports → Copilot readiness
- **Viva Insights** → Copilot adoption dashboard
- **Audit logs** → Search for Copilot interaction events in Purview

Monitor for:
- Users accessing documents they normally wouldn't open directly
- Copilot surfacing content from restricted or sensitive sites
- High-frequency Copilot usage in departments with weak permissions

### 7. User Training and Acceptable Use Policy

Create a Copilot acceptable use policy covering:

- **What's allowed**: Using Copilot for drafting documents, summarizing meetings, finding information
- **What's prohibited**: Sharing Copilot outputs that contain confidential data with external parties
- **Responsibility**: Users are responsible for verifying Copilot's outputs before acting on them
- **Reporting**: Process for reporting inappropriate Copilot responses (e.g., surfacing confidential data)

### 8. Regular Governance Reviews

Schedule quarterly reviews:

- [ ] Re-audit SharePoint permissions
- [ ] Review sensitivity label coverage
- [ ] Check DLP policy effectiveness
- [ ] Review Copilot usage reports
- [ ] Update restricted site list
- [ ] Refresh retention policies

## Copilot Governance Checklist

| Control | Priority | Status |
|---------|----------|--------|
| Permission audit | 🔴 Critical | Pre-deployment |
| Sensitivity labels | 🔴 Critical | Pre-deployment |
| Restricted sites | 🟠 High | Week 1 |
| DLP policies | 🟠 High | Week 1-2 |
| Retention policies | 🟡 Medium | Month 1 |
| Usage monitoring | 🟡 Medium | Ongoing |
| Acceptable use policy | 🟡 Medium | Pre-deployment |
| Quarterly reviews | 🟢 Standard | Ongoing |

## FAQ

### Does Copilot bypass SharePoint permissions?
No — Copilot strictly respects the user's existing permissions. It can only surface content the user already has access to. The risk isn't new access — it's that Copilot makes discovery so easy that oversights in permissions become practically exploitable.

### How do I know if our permissions are clean enough for Copilot?
Run a SharePoint access review. If more than 20% of your sites have "Everyone" or "Everyone except external users" with read access, you're not ready. Clean those up first.

### Can I disable Copilot for specific users or groups?
Yes. Use Microsoft 365 admin center to assign Copilot licenses selectively. Deploy to IT and a pilot group first, then expand after governance is proven.

### Does Copilot work with on-premises SharePoint?
No. Microsoft 365 Copilot only indexes content in SharePoint Online (cloud). On-premises SharePoint Server content is not accessible to Copilot.

## The Bottom Line

Microsoft Copilot is a powerful productivity tool — but it's only as safe as your governance framework. Before deploying, audit permissions, classify documents, restrict sensitive sites, and monitor usage. The organizations that get governance right will get the most value from Copilot. The ones that skip it will get a data leak.

Start with the 8-point checklist above. If you need help with the technical implementation, check out our guides on [PnP PowerShell administration](/blog/pnp-powershell-25-scripts-every-admin-needs) and [SharePoint permissions](/blog/sharepoint-permissions-explained-guide).

*This article reflects Microsoft 365 Copilot capabilities as of Q1 2026. Features and admin controls may change with future updates.*
`;

const article = {
  slug: 'microsoft-copilot-governance-best-practices-2026',
  title: 'Microsoft Copilot Governance: 8 Controls Every M365 Admin Needs (2026)',
  excerpt: 'Before deploying Microsoft 365 Copilot, implement these 8 governance controls — from SharePoint permission audits to sensitivity labels and usage monitoring.',
  category: 'Microsoft 365',
  date: new Date().toISOString().split('T')[0],
  display_date: 'April 2, 2026',
  read_time: '10 min read',
  image: '/images/blog/copilot-governance-hero.png',
  tags: ["copilot", "governance", "m365", "sharepoint", "purview", "security"],
  content: CONTENT.trim()
};

async function main() {
  const db = new SupabaseREST();
  const existing = await db.select('blog_posts', 'id,slug');
  if (existing.some(r => r.slug === article.slug)) {
    console.log('Article already exists, skipping.');
    return;
  }
  const maxId = existing.length > 0 ? Math.max(...existing.map(r => r.id)) : 0;
  const nextId = maxId + 1;
  const finalPayload = { id: nextId, ...article };

  const res = await fetch(db.restUrl + '/blog_posts', {
    method: 'POST', headers: db.headers, body: JSON.stringify(finalPayload)
  });
  if (!res.ok) throw new Error('Insert Failed: ' + res.status + ' ' + await res.text());
  console.log('✅ Inserted ID', nextId, ':', article.slug);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
