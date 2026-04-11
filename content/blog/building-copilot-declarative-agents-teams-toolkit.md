---
title: "Build Declarative Agents for M365 Copilot with Teams Toolkit"
slug: building-copilot-declarative-agents-teams-toolkit
excerpt: "Step-by-step guide to building declarative agents for M365 Copilot using Teams Toolkit, API plugins, and Graph connectors."
date: "2026-04-03"
displayDate: "April 3, 2026"
readTime: "14 min read"
category: "Microsoft 365"
image: "/images/blog/copilot-declarative-agents-guide.png"
tags:
  - "Copilot"
  - "declarative-agents"
  - "Teams Toolkit"
  - "Microsoft 365"
  - "AI"
---

Declarative agents are the fastest way to extend Microsoft 365 Copilot without building your own AI infrastructure. You define what the agent knows, what it can do, and how it should behave — and Copilot's orchestrator handles the rest.

This guide walks you through building a declarative agent from scratch using Teams Toolkit, adding API plugins for custom actions, and connecting Graph connectors for external data.

## What Are Declarative Agents?

Declarative agents are extensions of Microsoft 365 Copilot that run on the same orchestrator, LLM, and security stack. You don't train a model or host an inference endpoint. Instead, you declare three things in a JSON manifest:

- **Instructions** — system prompt that shapes the agent's personality and behavior
- **Knowledge sources** — SharePoint sites, Graph connectors, or files the agent can reference
- **Actions** — API plugins the agent can call to read or write external data

The key difference from custom engine agents: declarative agents use Copilot's own LLM and orchestration layer. You are configuring the existing Copilot, not replacing it.

### Declarative Agents vs Custom Engine Agents

| Aspect | Declarative Agents | Custom Engine Agents |
|--------|-------------------|---------------------|
| LLM | Microsoft 365 Copilot (hosted) | Your own (Azure OpenAI, etc.) |
| Hosting | No infrastructure needed | You manage compute and endpoints |
| Data access | M365 Graph, SharePoint, connectors | Whatever you wire up |
| Authentication | M365 SSO built-in | You implement auth |
| Customization | Instructions + plugins + knowledge | Full control over prompts and models |
| Best for | Extending Copilot with org-specific context | Scenarios requiring custom models or non-M365 data |

If your use case lives inside the Microsoft 365 ecosystem, declarative agents are almost always the right choice. You get Copilot's grounding, citation, and responsible AI controls out of the box.

## Architecture Overview

When a user interacts with a declarative agent, the request flows through the same pipeline as standard Copilot:

1. User sends a prompt in Copilot Chat, Teams, or another M365 surface
2. Copilot's orchestrator identifies which agent should handle the request
3. The agent's **instructions** shape the system prompt
4. The orchestrator queries the agent's **knowledge sources** (SharePoint, Graph connectors) for grounding data
5. If the query requires an external action, the orchestrator calls the agent's **API plugins**
6. The LLM generates a response grounded in the retrieved data
7. The response is returned with citations pointing to source documents

Your declarative agent manifest is the configuration layer that customizes steps 3-5. Everything else is handled by Copilot.

## Prerequisites

Before you start building, make sure you have:

- **Teams Toolkit** v5.10+ installed in VS Code (or the CLI equivalent via `npm install -g @microsoft/teamsapp-cli`)
- **Microsoft 365 developer tenant** with Copilot licenses assigned
- **Node.js 18+** and npm
- **Copilot enabled** for your tenant (admin center > Copilot settings)
- **Sideloading enabled** for your development account (Teams admin center > Teams apps > Setup policies)

If you don't have a developer tenant, sign up at [developer.microsoft.com/microsoft-365/dev-program](https://developer.microsoft.com/microsoft-365/dev-program).

## Step-by-Step: Build Your First Declarative Agent

### Create the Project

Open VS Code with Teams Toolkit installed and create a new project:

1. Open the command palette (Ctrl+Shift+P)
2. Select **Teams Toolkit: Create a New App**
3. Choose **Copilot Agent** > **Declarative Agent**
4. Select **No plugin** for now (you will add one later)
5. Name the project `hr-policy-agent`

Teams Toolkit generates the following structure:

```
hr-policy-agent/
  appPackage/
    declarativeAgent.json
    manifest.json
    color.png
    outline.png
  env/
    .env.dev
  teamsapp.yml
```

The two critical files are `manifest.json` (the Teams app manifest) and `declarativeAgent.json` (the agent definition).

### Define the Agent Manifest

Open `appPackage/declarativeAgent.json`. This is where you define the agent's behavior:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.3/schema.json",
  "version": "v1.3",
  "name": "HR Policy Agent",
  "description": "Answers questions about company HR policies, benefits, and leave procedures.",
  "instructions": "You are the HR Policy Agent for Contoso. Answer questions about HR policies, employee benefits, leave procedures, and onboarding processes. Always cite the specific policy document you are referencing. If you do not have enough information to answer a question, say so clearly and direct the user to contact HR at hr@contoso.com. Never speculate about policies that are not in your knowledge sources.",
  "capabilities": [
    {
      "name": "WebSearch",
      "isEnabled": false
    },
    {
      "name": "GraphicArt",
      "isEnabled": false
    },
    {
      "name": "CodeInterpreter",
      "isEnabled": false
    }
  ],
  "conversation_starters": [
    { "text": "What is our parental leave policy?" },
    { "text": "How do I submit a PTO request?" },
    { "text": "Explain the annual benefits enrollment process." }
  ]
}
```

Key decisions in this manifest:

- **instructions** — This is the system prompt. Be specific about what the agent should and should not do. Vague instructions produce vague results.
- **capabilities** — Disable capabilities the agent does not need. An HR policy bot has no reason to generate images or run code.
- **conversation_starters** — These appear as suggested prompts when users open the agent.

### Add Knowledge Sources

Knowledge sources ground the agent in your organization's data. Add a `knowledge` array to the manifest:

```json
{
  "knowledge": [
    {
      "type": "SharePoint",
      "sites": [
        {
          "url": "https://contoso.sharepoint.com/sites/HR"
        },
        {
          "url": "https://contoso.sharepoint.com/sites/HR/PolicyDocuments"
        }
      ]
    },
    {
      "type": "GraphConnector",
      "connections": [
        {
          "connection_id": "contosoHRIS"
        }
      ]
    }
  ]
}
```

The agent will use Copilot's semantic index to search these sources when responding to queries. SharePoint sites are indexed automatically. Graph connectors require separate setup (covered below).

## Adding API Plugins

API plugins let your agent call external services — read data from a CRM, submit a support ticket, or query a custom database. You define the API using an OpenAPI spec and a plugin manifest.

### Create the OpenAPI Spec

Add an `apiSpecificationFile` to your project at `appPackage/apispec.yaml`:

```yaml
openapi: 3.0.3
info:
  title: HR Service API
  version: 1.0.0
servers:
  - url: https://hr-api.contoso.com
paths:
  /api/leave-balance:
    get:
      operationId: getLeaveBalance
      summary: Get an employee's remaining leave balance
      parameters:
        - name: employeeId
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Leave balance details
          content:
            application/json:
              schema:
                type: object
                properties:
                  annualLeave:
                    type: number
                  sickLeave:
                    type: number
                  personalDays:
                    type: number
  /api/leave-request:
    post:
      operationId: submitLeaveRequest
      summary: Submit a new leave request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                startDate:
                  type: string
                  format: date
                endDate:
                  type: string
                  format: date
                leaveType:
                  type: string
                  enum: [annual, sick, personal]
      responses:
        '201':
          description: Leave request submitted
```

### Plugin Manifest

Create `appPackage/plugin.json` to link the API spec to the agent:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "schema_version": "v2.2",
  "name_for_human": "HR Service Plugin",
  "description_for_human": "Check leave balances and submit leave requests.",
  "description_for_model": "Use this plugin when the user asks about their leave balance, remaining PTO, or wants to submit a leave request. Do not use this plugin for general HR policy questions.",
  "functions": [
    {
      "name": "getLeaveBalance",
      "description": "Retrieves the remaining leave balance for an employee."
    },
    {
      "name": "submitLeaveRequest",
      "description": "Submits a new leave request for the signed-in user."
    }
  ],
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": {
        "type": "OAuthPluginVault",
        "reference_id": "contoso-hr-oauth"
      },
      "spec": {
        "url": "apispec.yaml"
      }
    }
  ]
}
```

Then reference the plugin in your `declarativeAgent.json`:

```json
{
  "actions": [
    {
      "id": "hrServicePlugin",
      "file": "plugin.json"
    }
  ]
}
```

### Authentication Configuration

For API plugins that require auth, register your API in the Teams Developer Portal under **Tools > OAuth client registration**. The `OAuthPluginVault` type stores the OAuth configuration securely and handles token exchange with Copilot's auth layer.

For APIs behind Azure AD, use the `OAuthPluginVault` type with these settings:

- **Authorization URL**: `https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/authorize`
- **Token URL**: `https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token`
- **Scope**: Your API's application ID URI (e.g., `api://hr-api.contoso.com/.default`)

Copilot will initiate an OAuth consent flow the first time a user triggers the plugin.

## Adding Graph Connectors for External Data

Graph connectors bring external data into the Microsoft 365 semantic index, making it searchable by Copilot. If your HR data lives in an external HRIS, a Graph connector makes it available to your declarative agent without building a custom API.

The high-level steps:

1. **Register a connection** using the Microsoft Graph API
2. **Define the schema** for your external items (fields, types, labels)
3. **Ingest items** via the Graph API
4. **Reference the connection** in your declarative agent's knowledge sources

```typescript
import { Client } from "@microsoft/microsoft-graph-client";

const client = Client.initWithMiddleware({ authProvider });

// Create the connection
await client.api("/external/connections").post({
  id: "contosoHRIS",
  name: "Contoso HRIS",
  description: "Employee records from the Contoso HR system"
});

// Define the schema
await client.api("/external/connections/contosoHRIS/schema").patch({
  baseType: "microsoft.graph.externalItem",
  properties: [
    { name: "employeeName", type: "String", isSearchable: true, isQueryable: true, labels: ["title"] },
    { name: "department", type: "String", isSearchable: true, isQueryable: true },
    { name: "role", type: "String", isSearchable: true },
    { name: "startDate", type: "DateTime", isQueryable: true }
  ]
});
```

Once ingested, reference the `contosoHRIS` connection ID in your agent's `knowledge` array as shown in the knowledge sources section above.

For a deeper look at Graph API authentication patterns, see [Microsoft Graph API Authentication Guide](/blog/microsoft-graph-api-authentication-guide).

## Testing and Debugging

Teams Toolkit makes local testing straightforward:

1. Press **F5** in VS Code (or run `teamsapp preview`)
2. Teams Toolkit provisions the app in your dev tenant and opens Copilot Chat
3. Your agent appears in the agent flyout — select it to start a conversation
4. Test your conversation starters and edge cases

Debugging tips:

- **Check the Developer Portal** (dev.teams.microsoft.com) for manifest validation errors
- **Use the Copilot activity log** in the Teams admin center to see how queries are routed
- **Monitor API plugin calls** in your API's logs — if Copilot isn't calling your plugin, refine the `description_for_model` field to be more specific about trigger conditions
- **Test knowledge grounding** by asking questions that should pull from specific documents, then verify the citations

## Deployment

When you are ready to ship:

1. Run `teamsapp package` to generate the app package (.zip)
2. Upload the package to the Teams admin center under **Manage apps**
3. Assign the app to the appropriate users or groups via setup policies
4. For organization-wide deployment, submit the app for admin approval

```bash
# Package the app
teamsapp package --env production

# Deploy to your tenant
teamsapp publish --env production
```

After deployment, users will find the agent in the Copilot Chat agent picker. Make sure your [governance controls](/blog/microsoft-copilot-governance-best-practices-2026) are in place before rolling out to production users.

## Comparison: Declarative Agents vs Copilot Studio vs Custom Engine Agents

| Feature | Declarative Agents | Copilot Studio | Custom Engine Agents |
|---------|-------------------|----------------|---------------------|
| LLM | Copilot (hosted) | Copilot (hosted) | Your own model |
| Development tool | Teams Toolkit / VS Code | Low-code designer | Any framework |
| Knowledge sources | SharePoint, Graph connectors | SharePoint, Dataverse, custom | Whatever you build |
| API integration | OpenAPI plugins | Power Automate connectors | Direct API calls |
| Authentication | M365 SSO | M365 SSO | You manage auth |
| Deployment surface | Copilot Chat, Teams | Copilot Chat, Teams, web | Teams, web, custom |
| Best for | Developers extending Copilot | Citizen developers, rapid prototyping | Complex AI scenarios outside M365 |
| Licensing | M365 Copilot license | Copilot Studio license | Azure consumption |

If you are deciding between Copilot Studio and declarative agents, the rule of thumb: use Copilot Studio for no-code scenarios and rapid prototyping, use declarative agents when you need source control, CI/CD pipelines, and developer-grade tooling. For a hands-on comparison, see [Copilot Studio + SharePoint: Build AI Assistants](/blog/copilot-studio-sharepoint-ai-assistants-guide-2026).

## FAQ

### Do declarative agents require a Copilot license for every user?

Yes. Every user who interacts with a declarative agent needs a Microsoft 365 Copilot license. The agent runs on Copilot's orchestrator, so the licensing requirement is the same as using Copilot Chat directly.

### Can I use declarative agents with data outside Microsoft 365?

Yes, through two mechanisms. **API plugins** let the agent call any REST API you expose with an OpenAPI spec. **Graph connectors** let you ingest external data into the Microsoft 365 index so the agent can search it alongside SharePoint content. For external data that changes frequently, API plugins are usually a better fit than Graph connectors.

### How do I control what data the agent can access?

Declarative agents inherit the signed-in user's permissions. If a user does not have access to a SharePoint site listed in the agent's knowledge sources, Copilot will not surface documents from that site in responses. You can further restrict scope by specifying exact site URLs and folder paths in the knowledge configuration. For a full governance framework, see [Microsoft Copilot Governance: 8 Controls Every M365 Admin Needs](/blog/microsoft-copilot-governance-best-practices-2026).

### Can I add Adaptive Cards to the agent's responses?

Yes. API plugins can return Adaptive Card templates in their responses, and Copilot will render them inline. This is useful for displaying structured data like leave balances, approval forms, or status dashboards. Define the card template in your OpenAPI response schema using the `adaptiveCardTemplate` property in the plugin manifest. For more on building Adaptive Cards, see [Adaptive Cards for Microsoft 365 Developers](/blog/adaptive-cards-m365-developer-guide).
