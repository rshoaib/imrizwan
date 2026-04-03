---
title: "Copilot Studio + SharePoint: Build 3 AI Assistants for Your Organization (2026)"
slug: copilot-studio-sharepoint-ai-assistants-guide-2026
excerpt: "Create AI assistants that answer from SharePoint docs and automate workflows with Microsoft Copilot Studio. No coding required."
date: "2026-03-05"
displayDate: "March 5, 2026"
readTime: "16 min read"
category: "Microsoft 365"
image: "/images/blog/copilot-studio-sharepoint-guide.png"
tags:
  - "copilot-studio"
  - "sharepoint"
  - "ai-assistants"
  - "power-automate"
  - "microsoft-365"
---


## Why Copilot Studio for SharePoint?

Microsoft Copilot Studio is a low-code platform for building AI agents (chatbots) that connect to your organization’s data. When combined with SharePoint, these agents can:

- **Answer questions** from documents stored in SharePoint libraries
- **Search across multiple sites** to find policies, procedures, and knowledge base articles
- **Automate workflows** by triggering Power Automate flows from a chat conversation
- **Serve employees directly** inside SharePoint pages, Teams, or Microsoft 365 Copilot Chat

Unlike generic chatbots, Copilot Studio agents are **grounded in your data** — they pull answers from your actual SharePoint content, not from the public internet.

**What changed in 2026?**

| Feature | Availability |
|---------|-------------|
| Copilot Studio agent deployment to SharePoint | GA (May 2025) |
| Grounding on SharePoint lists in Copilot Chat | March 2026 |
| AI-assisted content creation in SharePoint | Preview (March 2026) |
| Custom actions with Power Automate | GA |
| Multi-site knowledge grounding | GA |

This guide walks you through building 3 progressively complex agents:

1. **FAQ Bot** — Answers employee questions from a SharePoint document library
2. **Document Search Assistant** — Searches across multiple SharePoint sites
3. **Workflow Bot** — Performs actions (submitting requests, creating items) via Power Automate

## Prerequisites

- **Microsoft 365 license** with Copilot Studio access (E3/E5 or standalone license)
- **SharePoint Online** with at least one site containing documents
- **Power Automate** access (for the workflow bot)
- **Admin or site owner permissions** on the SharePoint sites you want to connect

## Agent 1: FAQ Bot

The simplest agent — it answers employee questions using documents from a single SharePoint site.

### Step 1: Create a New Agent

1. Go to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. Click **Create** in the left navigation
3. Select **New agent**
4. Give it a name: "HR Policy Assistant"
5. Add a description: "Answers questions about company HR policies, benefits, and procedures"
6. Click **Create**

### Step 2: Add SharePoint as a Knowledge Source

1. In your agent, go to the **Knowledge** tab
2. Click **+ Add knowledge**
3. Select **SharePoint**
4. Paste the URL of your SharePoint site (e.g., https://contoso.sharepoint.com/sites/HR)
5. You can add specific document libraries or folders for more focused results
6. Click **Add**

The agent will now index the documents in that SharePoint location. It uses Azure AI Search under the hood to understand document content and return relevant answers.

### Step 3: Configure the System Prompt

The system prompt controls how the agent behaves. Click **Settings** and edit the prompt:

    You are an HR Policy Assistant for Contoso.
    Answer questions using ONLY the documents provided
    in your knowledge sources.
    If you cannot find the answer, say: "I could not
    find this in our HR policies. Please contact
    hr@contoso.com for assistance."
    Always cite the document name where you found
    the answer.
    Keep answers concise - 2-3 paragraphs maximum.

### Step 4: Test the Agent

1. Click **Test your agent** in the top right
2. Ask a question like: "What is our parental leave policy?"
3. The agent should respond with information from your SharePoint documents
4. Verify it cites the correct source document

### Step 5: Deploy to SharePoint

1. Go to **Channels** in the left navigation
2. Click **SharePoint**
3. Select the SharePoint site where you want the agent to appear
4. Choose the page or create a new one
5. The agent will appear as a chat widget on that page

**Result:** Employees can now ask HR questions directly from a SharePoint page and get answers grounded in your actual policy documents.

## Agent 2: Document Search Assistant

This agent searches across **multiple SharePoint sites** — useful for organizations with department-specific sites (HR, IT, Legal, Finance).

### Add Multiple Knowledge Sources

In the Knowledge tab, add multiple SharePoint sources:

| Knowledge Source | SharePoint URL | Purpose |
|-----------------|----------------|---------|
| HR Policies | /sites/HR | Benefits, leave, onboarding |
| IT Knowledge Base | /sites/ITSupport | Troubleshooting, access requests |
| Legal Compliance | /sites/Legal | Contracts, compliance docs |
| Finance Procedures | /sites/Finance | Expense reports, budgets |

### Configure Search Behavior

Update the system prompt to handle multi-site searches:

    You are a company knowledge assistant for Contoso.
    You have access to documents from HR, IT, Legal,
    and Finance departments.
    When answering questions:
    1. Search across all available knowledge sources
    2. Always state which department the information
       comes from
    3. If multiple departments have relevant info,
       include all perspectives
    4. Cite the specific document and department

### Add Topic-Based Routing

For better accuracy, create **topics** that route questions to the right knowledge source:

1. Go to the **Topics** tab
2. Click **+ Add a topic**
3. Create topics like:
   - "IT Support" — triggered by phrases like "password reset", "VPN", "laptop"
   - "HR Questions" — triggered by "leave", "benefits", "salary"
   - "Legal Review" — triggered by "contract", "NDA", "compliance"

Each topic can have its own response instructions that prioritize the most relevant knowledge source.

### Enable Authentication

For sensitive documents, enable user authentication:

1. Go to **Settings** then **Security**
2. Select **Authenticate with Microsoft**
3. Enable "Require users to sign in"
4. The agent will now respect SharePoint permissions — users only see documents they have access to

> **Important:** Always enable authentication when the agent has access to confidential documents. This ensures SharePoint permission boundaries are respected.

## Agent 3: Workflow Bot with Custom Actions

This is the most powerful agent — it not only answers questions but **performs actions** by triggering Power Automate flows.

### Use Case: IT Service Desk Bot

The bot can:
- Answer IT questions from the knowledge base
- Submit support tickets to a SharePoint list
- Check the status of existing tickets
- Reset user permissions (via Power Automate)

### Step 1: Create the Power Automate Flow

First, create a flow that the agent can call. This example creates a support ticket in a SharePoint list:

1. Go to [make.powerautomate.com](https://make.powerautomate.com)
2. Create a new **Instant cloud flow**
3. Choose the trigger: **Run a flow from Copilot**
4. Add inputs:
   - **Title** (text) — The ticket subject
   - **Description** (text) — Detailed description
   - **Priority** (text) — Low, Medium, High
   - **UserEmail** (text) — The requester email

5. Add a SharePoint action: **Create item**
   - Site: https://contoso.sharepoint.com/sites/ITSupport
   - List: Support Tickets
   - Map the inputs to the list columns

6. Add a response: **Respond to Copilot**
   - Return the ticket ID and confirmation message

7. Save and test the flow

For more Power Automate patterns, see my [SharePoint document workflows guide](/blog/power-automate-sharepoint-document-workflows-2026).

### Step 2: Add the Action to Your Agent

1. In Copilot Studio, go to your agent
2. Click **Actions** in the left navigation
3. Click **+ Add an action**
4. Select **Power Automate flow**
5. Find and select your "Create Support Ticket" flow
6. Map the flow inputs to agent variables

### Step 3: Create a Topic for Ticket Submission

Create a topic that guides users through submitting a ticket:

1. Go to the **Topics** tab
2. Create a new topic: "Submit IT Ticket"
3. Add trigger phrases: "I need help", "submit a ticket", "IT support request"
4. Build the conversation flow:
   - Ask: "What is the issue?" (save to variable Title)
   - Ask: "Please describe the problem in detail" (save to variable Description)
   - Ask: "What priority? Low, Medium, or High?" (save to variable Priority)
   - Call the Power Automate action with the collected variables
   - Display the confirmation: "Your ticket #[TicketID] has been submitted"

### Step 4: Add a Status Check Action

Create a second flow that retrieves ticket status:

1. Create a Power Automate flow with trigger **Run a flow from Copilot**
2. Input: **TicketID** (text)
3. Action: SharePoint **Get items** with a filter (ID eq TicketID)
4. Response: Return the ticket status, assigned agent, and last update

Add this as another action in your agent with the topic "Check Ticket Status".

## Deployment Options

### Deploy to SharePoint Pages

1. Go to **Channels** then **SharePoint**
2. Select the target site
3. The agent appears as a chat interface on the page
4. Users interact with it directly in SharePoint

### Deploy to Microsoft Teams

1. Go to **Channels** then **Microsoft Teams**
2. Click **Turn on Teams**
3. The agent becomes available as a Teams app
4. Users can chat with it in Teams just like messaging a colleague

### Deploy to Microsoft 365 Copilot Chat

1. Go to **Channels** then **Microsoft 365 Copilot**
2. Publish the agent to the M365 App Store
3. Users can invoke it from Copilot Chat with @AgentName

### Audience Targeting

Control who can access your agent:

| Scope | How to Set |
|-------|-----------|
| Everyone in the organization | Default setting |
| Specific security groups | Settings then Security then User access |
| Specific SharePoint sites only | Deploy to selected sites only |

## Best Practices

| Practice | Why |
|----------|-----|
| Use specific knowledge sources over entire sites | Narrower scope = more accurate answers |
| Always enable authentication for confidential docs | Respects SharePoint permission boundaries |
| Create topic-based routing for multi-department agents | Improves answer relevance |
| Set fallback responses for unknown questions | Prevents hallucination |
| Test with real user questions before deploying | Catches edge cases early |
| Monitor analytics in Copilot Studio dashboard | Identify gaps in knowledge coverage |

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Agent returns "I do not know" for documented topics | Document not indexed | Re-add the knowledge source and wait for indexing |
| Agent gives wrong answers | Too broad knowledge scope | Narrow the knowledge source to specific libraries |
| Users cannot access the agent | Authentication not configured | Enable Microsoft authentication in Settings |
| Power Automate action fails | Flow not shared with agent service | Share the flow with the Copilot Studio service account |
| Agent does not appear on SharePoint page | Deployment not completed | Check the Channels tab and complete the SharePoint deployment |
| Slow responses | Large document libraries | Use specific folders instead of entire sites |

## Frequently Asked Questions

**Q: Does Copilot Studio require a separate license?**

Copilot Studio is included with Microsoft 365 E3/E5 licenses for basic scenarios. For advanced features (custom actions, extended message capacity), you may need a standalone Copilot Studio license. Check the Microsoft 365 licensing page for current details.

**Q: Can the agent access on-premises SharePoint?**

No. Copilot Studio agents only connect to SharePoint Online in Microsoft 365. For on-premises data, you would need to sync it to SharePoint Online first or use a custom connector.

**Q: How does the agent handle document permissions?**

When authentication is enabled, the agent respects SharePoint permissions. A user can only get answers from documents they have access to. This ensures your security model stays intact.

**Q: Can I use custom instructions to limit the agent scope?**

Yes. Use the system prompt to restrict what the agent discusses. For example: "Only answer questions about IT support topics. For HR questions, direct users to the HR portal." This prevents scope creep even if the knowledge sources contain broader content.

**Q: How many SharePoint sites can I connect?**

There is no hard limit on knowledge sources, but Microsoft recommends keeping the total under 10 for optimal indexing performance. For very large organizations, consider creating separate agents per department.

## What to Build Next

You have seen how to build 3 types of agents — from a simple FAQ bot to a workflow-powered service desk. The same patterns work for any scenario:

- **Onboarding assistant** that guides new hires through company policies
- **Project manager bot** that searches project documentation and updates task lists
- **Compliance checker** that answers regulatory questions from your legal library

For more Microsoft 365 development, check out my guides on [building SPFx web parts](/blog/spfx-web-part-crud-operations-complete-guide-2026), [Microsoft Graph API examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026), and [Power Automate workflows](/blog/power-automate-sharepoint-document-workflows-2026). To extend your agents to Viva Connections dashboards, see my [Adaptive Card Extensions guide](/blog/viva-connections-adaptive-card-extensions-build-guide-2026).

