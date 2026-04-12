---
title: "Power Automate + AI Builder: Document Processing Guide"
slug: power-automate-ai-builder-intelligent-document-processing
excerpt: "Extract and process data from invoices, receipts, and forms automatically using Power Automate and AI Builder. No coding or model training required."
date: "2026-03-03"
displayDate: "March 3, 2026"
readTime: "12 min read"
image: "/images/blog/power-automate-sharepoint-workflows.png"
category: "Power Platform"
tags:
  - "power-automate"
  - "ai-builder"
  - "document-processing"
  - "automation"
  - "low-code"
  - "microsoft-365"
---

## What Is Intelligent Document Processing?

**Intelligent Document Processing (IDP)** uses AI to automatically extract, classify, and process data from unstructured documents like invoices, receipts, contracts, and forms. Instead of manually typing data from a PDF into a spreadsheet, IDP reads the document for you.

In the Microsoft ecosystem, this is powered by **AI Builder** — a low-code AI capability built directly into the **Power Platform**. Combined with **Power Automate**, you can build end-to-end pipelines that:

1. Receive a document (via email, SharePoint upload, or Teams message)
2. Extract structured data using an AI model
3. Validate and route the data to downstream systems
4. Notify stakeholders and log an audit trail

All without writing a single line of traditional code.

## Why This Matters in 2026

The push toward **hyperautomation** — automating entire business processes rather than individual tasks — has made document processing one of the highest-ROI automation targets.

- **80% of enterprise data is unstructured** (PDFs, scanned images, emails)
- **AI Builder models are pre-trained on millions of documents**
- **Custom AI models** let you train on your own document formats with as few as 5 sample documents
- **Power Automate integration** means extracted data flows directly into SharePoint, Dataverse, Dynamics 365, or any of 1,000+ connectors

## Prerequisites

- **Power Automate Premium license** (AI Builder requires Premium or per-user plan)
- **AI Builder credits** — included with certain Microsoft 365 and Dynamics 365 plans
- **SharePoint Online** — for document storage and triggers
- **A Microsoft 365 environment** — developer tenant works fine for testing

## Step 1: Choose Your AI Model

AI Builder offers several prebuilt models that require zero training:

| Model | What It Extracts | Best For |
|-------|-----------------|----------|
| **Invoice Processing** | Vendor, amounts, line items, dates, PO numbers | Accounts payable automation |
| **Receipt Processing** | Merchant, total, tax, date, payment method | Expense report automation |
| **Identity Document Reader** | Name, DOB, address, document number | KYC/onboarding workflows |
| **Business Card Reader** | Name, title, company, email, phone | CRM lead capture |
| **Text Recognition (OCR)** | Raw text from any image or PDF | General-purpose extraction |
| **Custom Document Processing** | Any fields you define | Custom forms, applications |

## Step 2: Build the Power Automate Flow

### Trigger: When a File Is Created in SharePoint

1. Go to make.powerautomate.com
2. Click **Create** → **Automated cloud flow**
3. Name it: Invoice Processing Pipeline
4. Trigger: **When a file is created (properties only)** — SharePoint

### Action: Extract Information from Invoices

1. Click **New step** → search for **AI Builder**
2. Select **Extract information from invoices**
3. For the **Invoice file** parameter, use the dynamic content picker

AI Builder returns: Invoice ID, dates, vendor info, amounts, line items, and confidence scores.

### Action: Create Item in SharePoint List

Map the AI Builder outputs to your SharePoint list columns.

### Action: Handle Low-Confidence Results

Add a Condition to route uncertain results for human review with a threshold of 0.85.

## Step 3: Train a Custom AI Model (Optional)

For custom forms, insurance claims, or government applications, custom models give you granular control:

1. Go to make.powerapps.com → AI Builder → Explore
2. Click Document processing → Create custom model
3. Define fields you want to extract (e.g., "Claim Amount", "Claimant Name", "Date of Incident")
4. Upload 5+ representative sample documents
5. Manually tag each field in the samples so the model learns patterns
6. Train the model (typically takes 5-10 minutes)
7. Test with a new document to validate accuracy
8. Publish to make available in Power Automate

The more varied your training samples, the better the model generalizes to new documents. A model trained only on scanned invoices will perform poorly on digital PDFs.

## Step 4: Production-Ready Patterns

### Error Handling
Wrap AI Builder actions in Try-Catch using Scope actions.

### Batch Processing
Use Apply to each for high-volume document processing.

### Approval Workflow Integration
Combine with Power Automate Approvals for procure-to-pay workflows with tiered approval thresholds.

## Real-World Performance Metrics

| Metric | Before IDP | After IDP |
|--------|-----------|-----------|
| Invoice processing time | 15-20 min/invoice | 30 seconds |
| Error rate | 5-8% (human entry) | 1-2% (AI + human review) |
| Monthly capacity | ~500 invoices/person | ~5,000 invoices/person |

## Licensing and Costs

AI Builder uses a credit-based consumption model. Prebuilt and custom models cost ~1 credit per page. Credits are included with Power Automate Premium and related licenses.

## Tips and Best Practices

- Start with prebuilt models first
- Use PDF format when possible
- Set confidence thresholds per field (typically 0.8–0.95 depending on risk tolerance)
- Build a feedback loop for accuracy tracking
- Test with edge cases (multi-page, rotated, low-quality)
- Monitor AI Builder credit consumption in production (prebuilt: ~1 credit per page; custom: similar)

## FAQ: Confidence Scores & Production Deployment

### What's a confidence score and how do I use it?
AI Builder returns a confidence score (0–1) for each extracted field. A score of 0.95 means the model is 95% confident in the extraction. In your flow, check the confidence: if it's below your threshold (e.g., 0.85), flag the document for human review instead of auto-processing.

Example condition in Power Automate:
```
if(greater(outputs('Extract information from invoices')['body/vendorName/confidence'], 0.85),
  'Process automatically',
  'Route for manual review'
)
```

### How many documents do I need to train a custom model?
Minimum: 5 samples. Recommended: 20–50 for good accuracy. The more varied (different layouts, quality levels, languages), the better the model generalizes.

### What happens if AI Builder can't extract a field?
The field will be returned as `null` or empty. Always wrap downstream actions in conditions that check for null values using `coalesce()` to provide sensible defaults.

### Can I retrain a model after it's published?
Yes. Upload new samples, re-tag, and retrain. Publish a new version. Power Automate always uses the latest published version by default.

### How do I monitor production accuracy?
Log every extraction result and the actual correct value to a SharePoint list. Periodically audit: compare AI-extracted values to ground truth. If accuracy drops below your threshold, trigger retraining.

## What's Next for AI Builder in 2026

- Multi-modal document understanding
- Cross-document intelligence
- Continuous learning
- Natural language queries via Copilot

AI Builder is becoming the standard way to bridge physical documents and digital business processes in the Microsoft ecosystem.
