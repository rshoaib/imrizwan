---
title: "25 PnP PowerShell Scripts Every SharePoint Admin Needs (2026)"
slug: pnp-powershell-sharepoint-online-scripts-admin-guide-2026
excerpt: "Copy-paste PnP PowerShell scripts for SharePoint Online — bulk permissions, site provisioning, and reporting."
date: "2026-04-03"
displayDate: "April 3, 2026"
readTime: "14 min read"
category: "SharePoint"
image: "/images/blog/pnp-powershell-admin-scripts-guide.png"
tags:
  - "PnP PowerShell"
  - "SharePoint"
  - "automation"
  - "admin"
  - "PowerShell"
---

## Why PnP PowerShell Is the Admin's Best Tool in 2026

If you manage SharePoint Online, you already know the admin center only gets you so far. Bulk operations, recurring audits, and tenant-wide reporting all hit a wall in the browser UI. That is where PnP PowerShell comes in.

PnP PowerShell (the community-driven successor to the legacy SharePoint Online Management Shell) gives you direct access to SharePoint, Teams, Microsoft Graph, and Entra ID from a single module. In 2026, it remains the fastest way to automate SharePoint tasks without writing a full application. Certificate-based authentication makes it viable for unattended scripts and scheduled jobs, while the cmdlet surface covers virtually every operation the REST API exposes.

This guide gives you 25 production-ready scripts organized by category. Every block is copy-paste ready — just update the variables at the top and run.

## Installation and Connection

Before running any script below, you need the PnP PowerShell module installed and a connection to your tenant.

```powershell
# Install PnP PowerShell (run once)
Install-Module -Name PnP.PowerShell -Scope CurrentUser -Force

# Interactive connection (good for testing)
Connect-PnPOnline -Url "https://contoso.sharepoint.com" -Interactive

# Certificate-based connection (recommended for automation)
Connect-PnPOnline -Url "https://contoso.sharepoint.com" `
    -ClientId "your-app-id" `
    -Tenant "contoso.onmicrosoft.com" `
    -CertificatePath "C:\certs\PnPCert.pfx" `
    -CertificatePassword (ConvertTo-SecureString "YourPassword" -AsPlainText -Force)
```

> **Tip:** For unattended scripts running on Azure Automation or scheduled tasks, always use certificate authentication. App-only access tokens are more secure and do not expire like user sessions. See our [provisioning automation guide](/blog/sharepoint-provisioning-automation-guide-2026) for the full Entra ID app registration walkthrough.

## Site Management

### 1. Create a Modern Team Site

```powershell
# Create a new team site with a connected Microsoft 365 group
New-PnPSite -Type TeamSite `
    -Title "Project Alpha" `
    -Alias "project-alpha" `
    -Description "Collaboration site for Project Alpha" `
    -IsPublic:$false `
    -Owners @("admin@contoso.com")
```

### 2. Create a Communication Site

```powershell
# Create a communication site with a specific design
New-PnPSite -Type CommunicationSite `
    -Title "Company News" `
    -Url "https://contoso.sharepoint.com/sites/company-news" `
    -Description "Official company announcements" `
    -SiteDesign Showcase
```

### 3. Get All Sites in the Tenant

```powershell
# Export every site collection to CSV
$sites = Get-PnPTenantSite | Select-Object Url, Title, Template, StorageUsageCurrent, LastContentModifiedDate
$sites | Export-Csv -Path "C:\Reports\AllSites.csv" -NoTypeInformation
Write-Host "Exported $($sites.Count) sites"
```

### 4. Update Site Properties in Bulk

```powershell
# Set storage quota and sharing capability on multiple sites
$siteUrls = @(
    "https://contoso.sharepoint.com/sites/hr",
    "https://contoso.sharepoint.com/sites/finance",
    "https://contoso.sharepoint.com/sites/legal"
)

foreach ($url in $siteUrls) {
    Set-PnPTenantSite -Url $url `
        -StorageMaximumLevel 5120 `
        -SharingCapability ExistingExternalUserSharingOnly
    Write-Host "Updated: $url"
}
```

### 5. Delete and Restore Sites

```powershell
# Soft-delete a site
Remove-PnPTenantSite -Url "https://contoso.sharepoint.com/sites/old-project" -Force

# Restore from recycle bin
Restore-PnPTenantRecycleBinItem -Url "https://contoso.sharepoint.com/sites/old-project"
```

## Permission Management

For a deep dive on SharePoint permission models, see the [complete permissions guide](/blog/sharepoint-online-permissions-complete-guide).

### 6. Audit Site Permissions

```powershell
# Get all role assignments for a site
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/hr" -Interactive

$web = Get-PnPWeb -Includes RoleAssignments
foreach ($ra in $web.RoleAssignments) {
    $member = $ra.Member
    $roles = $ra.RoleDefinitionBindings | Select-Object -ExpandProperty Name
    [PSCustomObject]@{
        Principal = $member.Title
        Type      = $member.PrincipalType
        Roles     = ($roles -join ", ")
    }
} | Format-Table -AutoSize
```

### 7. Add Users to a SharePoint Group

```powershell
# Bulk-add users to the Members group
$users = @(
    "john@contoso.com",
    "jane@contoso.com",
    "alex@contoso.com"
)

foreach ($user in $users) {
    Add-PnPGroupMember -LoginName $user -Group "Project Alpha Members"
    Write-Host "Added $user"
}
```

### 8. Remove External Users from a Site

```powershell
# Find and remove all external users from a site collection
$externalUsers = Get-PnPUser | Where-Object { $_.LoginName -like "*#ext#*" }

foreach ($user in $externalUsers) {
    Remove-PnPUser -Identity $user.LoginName -Force
    Write-Host "Removed external user: $($user.Title)"
}

Write-Host "Removed $($externalUsers.Count) external users"
```

### 9. Break Permission Inheritance on a Library

```powershell
# Break inheritance on a library and grant specific access
$listName = "Confidential Documents"
Set-PnPList -Identity $listName -BreakRoleInheritance -CopyRoleAssignments

# Remove a group that should not have access
Set-PnPListPermission -Identity $listName -Group "Site Visitors" -RemoveRole "Read"

# Grant edit to a specific group
Set-PnPListPermission -Identity $listName -Group "Legal Team" -AddRole "Edit"
```

### 10. Export Unique Permissions Across All Lists

```powershell
# Find every list/library with broken inheritance
$lists = Get-PnPList -Includes HasUniqueRoleAssignments

$uniqueLists = $lists | Where-Object { $_.HasUniqueRoleAssignments -eq $true }
$uniqueLists | Select-Object Title, BaseTemplate, ItemCount | Format-Table -AutoSize

Write-Host "$($uniqueLists.Count) lists have unique permissions"
```

## List and Library Operations

### 11. Create a Custom List with Fields

```powershell
# Create a list and add columns
New-PnPList -Title "IT Requests" -Template GenericList

Add-PnPField -List "IT Requests" -DisplayName "Request Type" `
    -InternalName "RequestType" -Type Choice `
    -Choices @("Hardware", "Software", "Access", "Other")

Add-PnPField -List "IT Requests" -DisplayName "Priority" `
    -InternalName "Priority" -Type Choice `
    -Choices @("Low", "Medium", "High", "Critical")

Add-PnPField -List "IT Requests" -DisplayName "Assigned To" `
    -InternalName "AssignedTo" -Type User
```

### 12. Bulk Upload Files to a Library

```powershell
# Upload all files from a local folder to a document library
$localPath = "C:\Uploads\PolicyDocs"
$libraryName = "Shared Documents"
$targetFolder = "Policies/2026"

$files = Get-ChildItem -Path $localPath -File -Recurse

foreach ($file in $files) {
    Add-PnPFile -Path $file.FullName -Folder "$libraryName/$targetFolder"
    Write-Host "Uploaded: $($file.Name)"
}

Write-Host "Uploaded $($files.Count) files"
```

### 13. Query List Items with CAML

```powershell
# Get all high-priority items created in the last 30 days
$caml = @"
<View>
    <Query>
        <Where>
            <And>
                <Eq>
                    <FieldRef Name='Priority' />
                    <Value Type='Choice'>High</Value>
                </Eq>
                <Geq>
                    <FieldRef Name='Created' />
                    <Value Type='DateTime'>
                        <Today OffsetDays='-30' />
                    </Value>
                </Geq>
            </And>
        </Where>
    </Query>
    <RowLimit>100</RowLimit>
</View>
"@

$items = Get-PnPListItem -List "IT Requests" -Query $caml
$items | ForEach-Object {
    [PSCustomObject]@{
        Title    = $_["Title"]
        Priority = $_["Priority"]
        Created  = $_["Created"]
    }
} | Format-Table -AutoSize
```

### 14. Copy a List Between Sites

```powershell
# Copy list items from source to destination site
$sourceSite = "https://contoso.sharepoint.com/sites/source"
$destSite = "https://contoso.sharepoint.com/sites/destination"
$listName = "Contacts"

Connect-PnPOnline -Url $sourceSite -Interactive
$items = Get-PnPListItem -List $listName -PageSize 500

Connect-PnPOnline -Url $destSite -Interactive
foreach ($item in $items) {
    Add-PnPListItem -List $listName -Values @{
        "Title"   = $item["Title"]
        "Email"   = $item["Email"]
        "Company" = $item["Company"]
    }
}

Write-Host "Copied $($items.Count) items"
```

### 15. Set Column Default Values

```powershell
# Set default values on a document library for metadata
Set-PnPDefaultColumnValues -List "Shared Documents" -Field "Department" -Value "Engineering"
Set-PnPDefaultColumnValues -List "Shared Documents" -Field "Classification" -Value "Internal" `
    -Folder "Projects"
```

## Content Management

### 16. Find Large Files Across a Site

```powershell
# Find all files larger than 100 MB
$largeFiles = Get-PnPListItem -List "Documents" -PageSize 1000 | Where-Object {
    $_["File_x0020_Size"] -gt 104857600
}

$largeFiles | ForEach-Object {
    [PSCustomObject]@{
        FileName = $_["FileLeafRef"]
        SizeMB   = [math]::Round($_["File_x0020_Size"] / 1MB, 2)
        Modified = $_["Modified"]
        Author   = $_["Editor"].Email
    }
} | Sort-Object SizeMB -Descending | Format-Table -AutoSize
```

### 17. Audit Version History and Trim Versions

```powershell
# Report on version counts and storage impact
$items = Get-PnPListItem -List "Documents" -PageSize 500

$report = foreach ($item in $items) {
    $file = Get-PnPFile -Url $item["FileRef"] -AsFileObject
    $versions = Get-PnPFileVersion -Url $item["FileRef"]

    [PSCustomObject]@{
        FileName     = $item["FileLeafRef"]
        VersionCount = $versions.Count + 1
        CurrentSizeMB = [math]::Round($item["File_x0020_Size"] / 1MB, 2)
    }
}

$report | Sort-Object VersionCount -Descending | Select-Object -First 20 | Format-Table -AutoSize

# Trim versions older than 6 months (uncomment to execute)
# foreach ($item in $items) {
#     $versions = Get-PnPFileVersion -Url $item["FileRef"]
#     $cutoff = (Get-Date).AddMonths(-6)
#     $oldVersions = $versions | Where-Object { $_.Created -lt $cutoff }
#     foreach ($v in $oldVersions) {
#         Remove-PnPFileVersion -Url $item["FileRef"] -Identity $v.Id -Force
#     }
# }
```

### 18. Empty the Second-Stage Recycle Bin

```powershell
# Clear deleted items from the second-stage recycle bin to reclaim storage
$deletedItems = Get-PnPRecycleBinItem -SecondStage -RowLimit 500

Write-Host "Found $($deletedItems.Count) items in second-stage recycle bin"

# Calculate total size
$totalSizeMB = ($deletedItems | Measure-Object -Property Size -Sum).Sum / 1MB
Write-Host "Total size: $([math]::Round($totalSizeMB, 2)) MB"

# Clear all (uncomment to execute)
# Clear-PnPRecycleBinItem -SecondStageOnly -Force
```

### 19. Find and Remove Orphaned Files

```powershell
# Find files not modified in over 2 years
$cutoffDate = (Get-Date).AddYears(-2)

$staleFiles = Get-PnPListItem -List "Documents" -PageSize 1000 | Where-Object {
    [DateTime]$_["Modified"] -lt $cutoffDate
}

$staleFiles | ForEach-Object {
    [PSCustomObject]@{
        FileName    = $_["FileLeafRef"]
        LastModified = $_["Modified"]
        ModifiedBy  = $_["Editor"].Email
        Path        = $_["FileRef"]
    }
} | Export-Csv -Path "C:\Reports\StaleFiles.csv" -NoTypeInformation

Write-Host "Found $($staleFiles.Count) files not modified since $($cutoffDate.ToString('yyyy-MM-dd'))"
```

### 20. Bulk Update Metadata

```powershell
# Update a metadata column on all items matching a filter
$items = Get-PnPListItem -List "Documents" -PageSize 500

foreach ($item in $items) {
    if ($item["Department"] -eq "Marketing") {
        Set-PnPListItem -List "Documents" -Identity $item.Id -Values @{
            "Classification" = "Public"
            "ReviewDate"     = (Get-Date).AddYears(1).ToString("yyyy-MM-dd")
        }
    }
}
```

## Reporting and Compliance

### 21. Site Usage Report

```powershell
# Generate a usage report for all sites in the tenant
$sites = Get-PnPTenantSite -Detailed

$report = $sites | Select-Object @{N='Site';E={$_.Url}},
    @{N='StorageUsedGB';E={[math]::Round($_.StorageUsageCurrent / 1024, 2)}},
    @{N='StorageQuotaGB';E={[math]::Round($_.StorageMaximumLevel / 1024, 2)}},
    @{N='PercentUsed';E={
        if ($_.StorageMaximumLevel -gt 0) {
            [math]::Round(($_.StorageUsageCurrent / $_.StorageMaximumLevel) * 100, 1)
        } else { 0 }
    }},
    LastContentModifiedDate

$report | Sort-Object PercentUsed -Descending |
    Export-Csv -Path "C:\Reports\SiteUsage.csv" -NoTypeInformation

# Show sites above 80% capacity
$report | Where-Object { $_.PercentUsed -gt 80 } | Format-Table -AutoSize
```

### 22. External Sharing Audit

```powershell
# Audit all sites with external sharing enabled
$sites = Get-PnPTenantSite

$externalSites = $sites | Where-Object {
    $_.SharingCapability -ne "Disabled"
} | Select-Object Url, Title, SharingCapability, LastContentModifiedDate

$externalSites | Export-Csv -Path "C:\Reports\ExternalSharingAudit.csv" -NoTypeInformation
Write-Host "$($externalSites.Count) sites have external sharing enabled"

# Breakdown by sharing level
$externalSites | Group-Object SharingCapability | Select-Object Name, Count | Format-Table -AutoSize
```

### 23. Storage Report by Library

```powershell
# Break down storage usage by library within a site
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/hr" -Interactive

$lists = Get-PnPList | Where-Object { $_.BaseTemplate -eq 101 }

$storageReport = foreach ($list in $lists) {
    $items = Get-PnPListItem -List $list -PageSize 1000
    $totalSize = ($items | ForEach-Object { $_["File_x0020_Size"] } |
        Measure-Object -Sum).Sum

    [PSCustomObject]@{
        Library  = $list.Title
        Files    = $items.Count
        SizeGB   = [math]::Round($totalSize / 1GB, 2)
    }
}

$storageReport | Sort-Object SizeGB -Descending | Format-Table -AutoSize
```

### 24. Inactive Sites Report

```powershell
# Find sites with no activity in the last 90 days
$cutoff = (Get-Date).AddDays(-90)

$inactiveSites = Get-PnPTenantSite | Where-Object {
    $_.LastContentModifiedDate -lt $cutoff
} | Select-Object Url, Title, LastContentModifiedDate,
    @{N='DaysInactive';E={((Get-Date) - $_.LastContentModifiedDate).Days}}

$inactiveSites | Sort-Object DaysInactive -Descending |
    Export-Csv -Path "C:\Reports\InactiveSites.csv" -NoTypeInformation

Write-Host "$($inactiveSites.Count) sites inactive for 90+ days"
```

### 25. Sensitivity Label Compliance Check

```powershell
# Check which sites have sensitivity labels applied
$sites = Get-PnPTenantSite -Detailed

$labelReport = $sites | Select-Object Url, Title, SensitivityLabel,
    @{N='HasLabel';E={$_.SensitivityLabel -ne [Guid]::Empty}}

$unlabeled = $labelReport | Where-Object { -not $_.HasLabel }
Write-Host "$($unlabeled.Count) of $($labelReport.Count) sites are missing sensitivity labels"

$unlabeled | Export-Csv -Path "C:\Reports\UnlabeledSites.csv" -NoTypeInformation
```

## Quick Reference: Most-Used PnP Cmdlets

| Cmdlet | Purpose |
|--------|---------|
| `Connect-PnPOnline` | Authenticate to a SharePoint site |
| `Get-PnPTenantSite` | List all site collections in the tenant |
| `New-PnPSite` | Create team or communication sites |
| `Set-PnPTenantSite` | Update site properties (quota, sharing, etc.) |
| `Get-PnPList` | Get lists and libraries on the current site |
| `Get-PnPListItem` | Retrieve list items with optional CAML queries |
| `Add-PnPFile` | Upload files to a document library |
| `Get-PnPUser` | Get users on the current site |
| `Add-PnPGroupMember` | Add a user to a SharePoint group |
| `Get-PnPRecycleBinItem` | List items in the recycle bin |
| `Set-PnPListPermission` | Grant or revoke permissions on a list |
| `Get-PnPFileVersion` | Retrieve version history for a file |

For a full list of cmdlets, run `Get-Command -Module PnP.PowerShell` after installing the module.

## Tips for Production Scripts

**Error handling matters.** Wrap your bulk operations in try/catch blocks and log failures. A script that silently skips 50 items is worse than one that fails loudly on the first.

**Use `-PageSize` with large lists.** `Get-PnPListItem` defaults to returning all items, which will time out on lists with more than 5,000 items. Always set `-PageSize 500` or `-PageSize 1000` and let PnP handle the pagination.

**Throttling is real.** SharePoint Online will throttle you if you hit it too hard. PnP PowerShell handles retry-after headers automatically, but you can reduce throttling by adding small delays in loops with `Start-Sleep -Milliseconds 200` for write-heavy operations.

**Test with `-WhatIf` when available.** Several PnP cmdlets support the `-WhatIf` parameter. Use it before running destructive operations against production.

Want to generate scripts without writing them from scratch? Try the [PnP Script Generator](/tools/pnp-script-generator) to build common operations interactively.

## Frequently Asked Questions

### Is PnP PowerShell free to use?

Yes. PnP PowerShell is a free, open-source community project maintained by the Microsoft 365 & Power Platform Community. It is not an official Microsoft product, but Microsoft employees actively contribute to it. You can install it from the PowerShell Gallery with `Install-Module PnP.PowerShell`.

### What is the difference between PnP PowerShell and the SharePoint Online Management Shell?

The SharePoint Online Management Shell (the `Microsoft.Online.SharePoint.PowerShell` module) is Microsoft's official module, but it only covers tenant-level and site collection administration. PnP PowerShell goes much further: it covers lists, libraries, files, pages, Teams, Planner, Microsoft Graph, and more. For day-to-day admin work, PnP PowerShell is the more practical choice.

### How do I set up certificate authentication for unattended scripts?

You need an Entra ID (Azure AD) app registration with a certificate. The high-level steps are: register an app in Entra ID, upload a certificate to the app, grant it the `Sites.FullControl.All` application permission (or a more scoped permission), and then use `Connect-PnPOnline` with `-ClientId`, `-Tenant`, and `-CertificatePath`. Our [provisioning automation guide](/blog/sharepoint-provisioning-automation-guide-2026) walks through this step by step.

### Can I use PnP PowerShell with Azure Automation?

Absolutely. Upload the PnP.PowerShell module to your Azure Automation account, store your certificate in the Automation certificate store, and use `Connect-PnPOnline` with certificate parameters in your runbook. This is the recommended approach for scheduled SharePoint maintenance tasks like the reporting scripts in this guide.

## The Bottom Line

These 25 scripts cover the operations that make up 90% of a SharePoint admin's weekly workload. Instead of clicking through the admin center for each site, you can run a single script that handles all of them in minutes.

Start with the scripts that solve your most immediate pain point — usually the [permissions audit](#6-audit-site-permissions) or the [storage report](#21-site-usage-report) — and build from there. Once you have certificate auth configured, you can schedule any of these as recurring jobs and stop doing manual work entirely.

For more on SharePoint administration, check out the [permissions complete guide](/blog/sharepoint-online-permissions-complete-guide) or explore our [PnP Script Generator](/tools/pnp-script-generator) to build custom scripts for your specific environment.
