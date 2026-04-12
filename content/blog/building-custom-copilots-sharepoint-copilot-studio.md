---
title: "Build Custom Copilots for SharePoint"
slug: building-custom-copilots-sharepoint-copilot-studio
excerpt: "Step-by-step guide to building AI copilots with Copilot Studio grounded in SharePoint. Answers questions only from your org's documents securely."
date: "2026-03-04"
displayDate: "March 4, 2026"
readTime: "16 min read"
image: "/images/blog/copilot-studio-sharepoint-guide.png"
category: "Microsoft 365"
tags:
  - "copilot-studio"
  - "sharepoint"
  - "microsoft-365"
  - "ai"
  - "declarative-agents"
  - "power-platform"
  - "copilot"
---

## What Is Microsoft Copilot Studio?

**Microsoft Copilot Studio** is the platform for building custom AI assistants — called **copilots** or **declarative agents** — that integrate with Microsoft 365 services including SharePoint, Teams, Outlook, and the Power Platform. Think of it as the Power Apps of AI: a low-code environment where you can create purpose-built AI agents grounded in your organization's data.

Unlike generic ChatGPT-style tools, a custom copilot built with Copilot Studio:

- **Only answers from your data** — grounded in specific SharePoint sites, libraries, and lists
- **Respects existing permissions** — users only see content they already have access to
- **Integrates with business processes** — can trigger Power Automate flows, update lists, and send notifications
- **Deploys where people work** — embedded directly in SharePoint pages, Teams, or Outlook

In 2026, Copilot Studio has become the primary way organizations extend Microsoft 365 Copilot with domain-specific knowledge and workflows.

## Why Build a Custom Copilot for SharePoint?

Out-of-the-box Microsoft 365 Copilot searches across your entire tenant — every email, Teams chat, OneDrive file, and SharePoint site the user has access to. This is powerful but often too broad.

A **custom copilot scoped to specific SharePoint content** solves real business problems:

- **HR Knowledge Base Copilot** — Answers employee questions using only the HR policy library
- **IT Help Desk Agent** — Responds to IT tickets using the internal KB and troubleshooting guides
- **Project Status Copilot** — Summarizes project updates from a specific SharePoint site
- **Onboarding Assistant** — Guides new hires through onboarding documents and checklists
- **Compliance Q&A** — Answers regulatory questions using the legal/compliance document library

Each of these copilots delivers faster, more accurate answers because the knowledge scope is narrow and well-curated.

## Prerequisites

Before you start building:

- **Microsoft 365 Copilot license** — required for users interacting with the copilot in default mode
- **Copilot Studio license** — standalone license available for development and testing
- **SharePoint Online** — with modern experience enabled (classic sites are not supported)
- **Azure App Registration** — for Graph API permissions (File.Read, Sites.Read)
- **Global Admin or Power Platform Admin** — to approve connectors and permissions

## Step 1: Create Your Copilot

### Open Copilot Studio

1. Navigate to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. Sign in with your Microsoft 365 work account
3. Click **Create** → **New agent**

### Configure Basic Settings

```
Name: HR Policy Assistant
Description: Answers employee questions about company policies,
             benefits, and procedures using the HR SharePoint site
Instructions: You are an HR knowledge assistant for Contoso.
              Answer questions using only the HR Policy Library.
              If you don't know the answer, suggest contacting
              hr@contoso.com. Be professional and concise.
              Never make up information not in the source documents.
```

The **Instructions** field is critical — it's the system prompt that controls your copilot's behavior, tone, and boundaries. Be specific about:

- What the copilot should and shouldn't answer
- The tone (formal, friendly, technical)
- Fallback behavior when information isn't available
- Data boundaries (only answer from specified sources)

## Step 2: Add SharePoint as a Knowledge Source

This is where you connect your copilot to your organization's data.

### Add Knowledge Sources

1. In Copilot Studio, go to the **Knowledge** tab
2. Click **Add knowledge** → **SharePoint**
3. Enter your SharePoint site URLs:

```
https://contoso.sharepoint.com/sites/HR
https://contoso.sharepoint.com/sites/HR/PolicyLibrary
```

### Supported Content Types

Copilot Studio can read and index the following SharePoint content:

| Content Type | Supported | Notes |
|-------------|-----------|-------|
| **Word documents (.docx)** | ✅ Yes | Best format for knowledge bases |
| **PDF files** | ✅ Yes | Including scanned PDFs (OCR) |
| **PowerPoint (.pptx)** | ✅ Yes | Extracts text from slides |
| **Modern SharePoint pages** | ✅ Yes | Great for wikis and FAQs |
| **SharePoint lists** | ✅ Yes | New in 2026 — structured data grounding |
| **Excel files** | ⚠️ Limited | Simple tables only |
| **OneNote** | ❌ No | Use Word/PDF instead |
| **Videos/Images** | ❌ No | Text-based content only |

### Best Practices for Knowledge Content

The quality of your copilot is directly proportional to the quality of your SharePoint content:

- **Use clear headings and sections** — Copilot uses document structure to find relevant answers
- **Write in Q&A format when possible** — "What is our vacation policy?" followed by the answer works extremely well
- **Keep documents focused** — One topic per document performs better than a 100-page manual
- **Update regularly** — Stale content leads to outdated answers
- **Use metadata** — SharePoint columns and tags help Copilot understand content context

## Step 3: Configure Authentication

Authentication ensures your copilot respects SharePoint permissions and accesses content securely.

### Set Up Azure App Registration

1. Go to [portal.azure.com](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations**
2. Click **New registration**
3. Configure:

```
Name: Copilot Studio - HR Assistant
Supported account types: Accounts in this organizational directory only
Redirect URI: https://token.botframework.com/.auth/web/redirect
```

4. After registration, note the **Application (client) ID** and **Directory (tenant) ID**

### Add API Permissions

In the app registration, go to **API permissions** → **Add a permission** → **Microsoft Graph**:

```
Delegated permissions:
  ✅ Files.Read.All
  ✅ Sites.Read.All
  ✅ User.Read
```

Click **Grant admin consent** to approve these permissions for the entire tenant.

### Create a Client Secret

1. Go to **Certificates & secrets** → **New client secret**
2. Description: `Copilot Studio Auth`
3. Expiry: 24 months
4. Copy the **Value** immediately (it won't be shown again)

### Connect to Copilot Studio

Back in Copilot Studio:

1. Go to **Settings** → **Security** → **Authentication**
2. Select **Authenticate with Microsoft**
3. Enter your App Registration details:
   - **Client ID:** (from step 4)
   - **Client Secret:** (from the secret you created)
   - **Tenant ID:** (your Microsoft Entra ID tenant ID)

## Step 4: Build Custom Topics and Actions

Topics define how your copilot responds to specific types of questions. While the AI handles most queries automatically using the knowledge base, custom topics let you add structured workflows.

### Example: Leave Request Topic

Create a topic that guides employees through submitting a leave request:

```
Trigger phrases:
  - "I want to request leave"
  - "How do I take time off"
  - "Submit vacation request"
  - "PTO request"

Flow:
  1. Ask: "What type of leave?" (Annual, Sick, Personal)
  2. Ask: "Start date?"
  3. Ask: "End date?"
  4. Ask: "Any notes for your manager?"
  5. Action: Trigger Power Automate flow → Create item in
     "Leave Requests" SharePoint list
  6. Confirm: "Your leave request has been submitted.
     Your manager will be notified."
```

### Integrating Power Automate Actions

Copilot Studio can trigger Power Automate flows directly from conversations:

1. In your topic, add an **Action** node
2. Select **Call a Power Automate flow**
3. Create or select a flow that:
   - Creates a new item in a SharePoint list
   - Sends an approval request to the user's manager
   - Posts a notification to a Teams channel

This transforms your copilot from a Q&A bot into an **interactive business process assistant**.

### Curated Tool Groups

New in 2026, Copilot Studio offers **curated tool groups** for SharePoint and Outlook:

- **SharePoint Tool Group** — Pre-built actions for searching sites, reading list items, creating documents, and managing permissions
- **Outlook Tool Group** — Actions for reading emails, scheduling meetings, and sending messages

These tool groups dramatically reduce setup time — you don't need to build custom Power Automate flows for common operations.

## Step 5: Test Your Copilot

### Built-in Test Chat

Copilot Studio includes a test panel on the right side of the editor:

1. Click **Test your copilot** in the top-right corner
2. Ask questions that should be answerable from your SharePoint content:

```
You: What is the company vacation policy?
Bot: According to the Employee Handbook, full-time employees
     receive 20 days of annual leave per year. Leave must be
     requested at least 2 weeks in advance through the HR
     portal. [Source: Employee Handbook, Section 4.2]

You: How many sick days do I get?
Bot: Full-time employees are entitled to 10 paid sick days
     per year. Sick leave exceeding 3 consecutive days requires
     a medical certificate. [Source: Benefits Guide, Page 12]
```

### Key Test Scenarios

Test these scenarios before deploying:

- **In-scope questions** — Should return accurate answers with citations
- **Out-of-scope questions** — Should gracefully decline ("I can only answer questions about HR policies")
- **Ambiguous questions** — Should ask for clarification
- **Multi-turn conversations** — Should maintain context across multiple exchanges
- **Permission boundaries** — Test with users who have different access levels

## Step 6: Deploy to SharePoint

### Option A: SharePoint Channel (Recommended)

The new **SharePoint channel** in Copilot Studio (available since late 2025) provides the simplest deployment:

1. In Copilot Studio, go to **Channels** → **SharePoint**
2. Click **Turn on** → Select the SharePoint sites where the copilot should appear
3. The copilot automatically appears in the site's AI assistant panel

### Option B: Embed via Web Part

For more control over placement:

1. In Copilot Studio, go to **Channels** → **Custom website**
2. Copy the **Embed code** (an iframe snippet)
3. In your SharePoint page, add an **Embed** web part
4. Paste the iframe code
5. Publish the page

### Option C: Deploy to Microsoft Teams

For organization-wide availability:

1. Go to **Channels** → **Microsoft Teams**
2. Click **Open in Teams** → Your copilot opens as a Teams app
3. Users can pin it to their sidebar for instant access

### Option D: Outlook Integration

Deploy as an Outlook add-in:

1. Go to **Channels** → **Outlook**
2. Follow the setup wizard
3. Users can query the copilot directly from their inbox

## Governance and Security

### Permission Inheritance

Your copilot **inherits SharePoint permissions automatically**. This means:

- If User A has Read access to the HR Policy Library → Copilot shows HR policy answers
- If User B has No access to HR → Copilot says "I don't have information about that"
- If documents are protected by Sensitivity Labels → Copilot respects those restrictions

You don't need to configure separate access controls — SharePoint's permission model is the single source of truth. (For more on managing these permissions effectively, see our [SharePoint Permissions Guide](/blog/sharepoint-online-permissions-complete-guide).)

### The Oversharing Risk

The same oversharing risks that apply to Microsoft 365 Copilot apply to custom copilots. If your SharePoint sites have overly broad permissions, your copilot will surface that content to everyone.

**Before deploying a copilot:**
1. Audit the target SharePoint site's permissions using our [Permission Matrix Generator](/tools/permission-matrix)
2. Remove "Everyone" and "Everyone except external users" from sensitive libraries
3. Apply Sensitivity Labels to confidential documents
4. Review external sharing settings

### Monitoring and Analytics

Copilot Studio provides built-in analytics:

- **Session metrics** — Total conversations, average duration, resolution rate
- **Topic performance** — Which topics are triggered most frequently
- **Knowledge gaps** — Questions the copilot couldn't answer (gold mine for content improvement)
- **User satisfaction** — Thumbs up/down ratings on responses

Review these metrics weekly to identify knowledge gaps and improve your copilot's accuracy.

## Advanced: Multi-Source Copilots

For complex scenarios, you can combine multiple knowledge sources in a single copilot:

```
HR Policy Copilot — Knowledge Sources:
  1. SharePoint: /sites/HR/PolicyLibrary (policies & handbooks)
  2. SharePoint: /sites/HR/FAQs (frequently asked questions)
  3. SharePoint: /sites/HR/Benefits (benefits documentation)
  4. Dataverse: Employee Benefits table (structured data)
  5. Website: benefits-provider.com/contoso (external content)
```

The copilot intelligently searches across all sources and synthesizes answers. When multiple sources contain relevant information, it combines them and cites each source.

## Advanced: Declarative Agents

**Declarative agents** are the next evolution of custom copilots — lightweight agents defined entirely through configuration (no code). They run inside Microsoft 365 Copilot itself, appearing alongside the base Copilot experience.

### Key Differences

| Feature | Custom Copilot | Declarative Agent |
|---------|---------------|-------------------|
| **Runs in** | Standalone channel | Inside M365 Copilot |
| **Created via** | Copilot Studio full editor | Copilot Studio or JSON manifest |
| **Complexity** | Full workflows, topics, actions | Simpler — instructions + knowledge |
| **Best for** | Complex interactive workflows | Focused Q&A and search |

### Creating a Declarative Agent

1. In Copilot Studio, click **Create** → **New agent** → **Declarative agent**
2. Define instructions and knowledge sources
3. Users access it via the **@mention** pattern in Microsoft 365 Copilot:

```
User: @HR Assistant What is the parental leave policy?
Copilot: Based on the Employee Handbook (updated January 2026),
         Contoso offers 16 weeks of paid parental leave for
         primary caregivers and 8 weeks for secondary caregivers...
```

Declarative agents are ideal when you want to extend Copilot's knowledge without building a full standalone bot.

## Common Issues and Troubleshooting

### "I don't have information about that"

**Cause:** Content isn't indexed or the user doesn't have permission.

**Fix:**
- Verify the SharePoint site URL is correct in Knowledge settings
- Check that documents are in supported formats (Word, PDF, PPTX)
- Confirm the user has at least Read access to the content
- Wait 15-30 minutes for new content to be indexed

### Inaccurate or Hallucinated Answers

**Cause:** Instructions are too vague, or source content is ambiguous.

**Fix:**
- Tighten the Instructions field: "Only answer based on the provided knowledge sources. If the answer is not in the sources, say 'I don't have information about that.'"
- Improve source document quality — clear headings, structured content
- Add explicit Q&A pairs in your SharePoint content for common questions

### Slow Response Times

**Cause:** Too many knowledge sources or very large document libraries.

**Fix:**
- Limit knowledge sources to 2-3 focused SharePoint sites
- Break large document libraries into smaller, topic-specific ones
- Remove outdated or duplicate documents from the knowledge base

## What's Coming in Late 2026

Microsoft's roadmap for Copilot Studio includes exciting capabilities:

- **Autonomous agents** — Copilots that can operate independently, monitoring SharePoint for changes and taking action without user prompts
- **Multi-agent orchestration** — Multiple specialized copilots collaborating on complex tasks
- **Enhanced reasoning** — Deeper analytical capabilities for complex document analysis
- **Natural language site generation** — "AI in SharePoint" feature that creates entire sites, pages, and lists from natural language descriptions
- **Copilot API** — Programmatic access to create and manage copilots at scale

## Next Steps

1. **Start small** — Build a copilot for one specific SharePoint site with well-curated content
2. **Curate your content** — The best copilot is only as good as its knowledge base
3. **Audit permissions** — Use our [Permission Matrix Generator](/tools/permission-matrix) to verify access before deployment
4. **Test thoroughly** — Try every edge case before rolling out to users
5. **Monitor and improve** — Use Copilot Studio analytics to find and fill knowledge gaps
6. **Scale gradually** — Once proven, expand to additional sites and use cases

Custom copilots are the most impactful way to deliver AI value in your Microsoft 365 environment. By grounding responses in curated SharePoint content and respecting existing permissions, you create AI assistants that are both powerful and trustworthy.

