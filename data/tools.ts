export const tools = [
    {
        name: 'GUID / UUID Generator',
        slug: 'guid-generator',
        description:
            'Generate v4 UUIDs instantly for SPFx manifests, Azure AD registrations, Teams apps, and Power Platform solutions.',
        emoji: '🔑',
        tags: ['SPFx', 'Azure AD', 'Teams'],
        faqs: [
            { question: 'What is a GUID and how is it different from a UUID?', answer: 'A <strong>GUID</strong> (Globally Unique Identifier) and <strong>UUID</strong> (Universally Unique Identifier) are functionally identical — both are 128-bit identifiers formatted as 32 hexadecimal characters. Microsoft uses the term "GUID" while the broader industry standard (RFC 4122) uses "UUID". In M365 development, they are interchangeable.' },
            { question: 'Why does SPFx require a GUID in the manifest?', answer: 'Every SharePoint Framework (SPFx) web part, extension, and library requires a <strong>unique component ID</strong> in its <code>manifest.json</code>. This ID is used by the App Catalog to register your solution and prevent conflicts with other components deployed to the same tenant.' },
            { question: 'Are these GUIDs cryptographically random?', answer: 'Yes. This tool generates standard <strong>Version 4 UUIDs</strong> using the browser\'s <code>crypto.getRandomValues()</code> API, which provides cryptographically secure random numbers. They are perfectly suited for Azure AD app registrations and SPFx manifests.' },
            { question: 'Where do I need GUIDs in Microsoft 365 development?', answer: 'GUIDs are required for: <strong>SPFx component IDs</strong> (manifest.json), <strong>Azure AD app registrations</strong> (client IDs), <strong>Teams app manifests</strong>, <strong>Power Platform solution IDs</strong>, <strong>SharePoint Content Type IDs</strong>, and <strong>Feature IDs</strong> in SharePoint provisioning.' },
            { question: 'Can I reuse GUIDs across different projects?', answer: 'No. Each GUID must be <strong>globally unique</strong>. Reusing a GUID from one SPFx web part in another will cause conflicts in the App Catalog. Always generate a fresh GUID for each new component, app registration, or solution.' },
            { question: 'How do I generate a GUID in PowerShell?', answer: 'You can run <code>[guid]::NewGuid()</code> in PowerShell to generate a GUID. However, this tool is faster for bulk generation and lets you copy multiple formats (with/without hyphens, uppercase, braces) in one click.' },
            { question: 'What format should my GUID be in for Azure AD?', answer: 'Azure AD accepts GUIDs in the standard <strong>lowercase hyphenated format</strong>: <code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>. Do not include curly braces. The "4" indicates Version 4 (random), and "y" is one of 8, 9, a, or b.' },
        ]
    },
    {
        name: 'JSON Column Formatter',
        slug: 'json-column-formatter',
        description:
            'Write, validate, and preview SharePoint JSON column formatting — with built-in templates and a live preview.',
        emoji: '🎨',
        tags: ['SharePoint', 'JSON', 'Formatting'],
        faqs: [
            { question: 'What is SharePoint JSON Column Formatting?', answer: 'JSON Column Formatting is a <strong>declarative, no-code</strong> way to customize how fields in SharePoint lists and libraries are displayed. You write a JSON schema that defines how data should be rendered — adding colors, icons, progress bars, and conditional styling — without changing the underlying data.' },
            { question: 'Where do I paste column formatting JSON?', answer: 'In your SharePoint list, click the <strong>column header → Column settings → Format this column</strong>. Switch to <strong>Advanced mode</strong> and paste your JSON. Click "Preview" to verify, then "Save". The formatting persists for all users who view the list.' },
            { question: 'Does SharePoint column formatting support Excel-style expressions?', answer: 'Yes! The <strong>v2 JSON schema</strong> supports Excel-style expressions like <code>=if(@currentField > 10, "Green", "Red")</code>. You can reference other columns using <code>[$ColumnInternalName]</code>, the current user with <code>@me</code>, and the current date with <code>@now</code>.' },
            { question: 'What is the difference between column formatting and view formatting?', answer: '<strong>Column formatting</strong> customizes a single column\'s appearance. <strong>View formatting</strong> lets you control the entire row layout — useful for creating card-based views, conditional row highlighting, or completely custom list visuals using the <code>rowFormatter</code> property.' },
            { question: 'Can I add clickable buttons with column formatting?', answer: 'Yes. You can create <strong>action buttons</strong> using the <code>customRowAction</code> property with actions like <code>executeFlow</code> (trigger a Power Automate flow), <code>share</code>, <code>delete</code>, or <code>editProps</code>. This is powerful for building lightweight approval workflows directly in lists.' },
            { question: 'What are the limits of JSON column formatting?', answer: 'Column formatting cannot: modify data, call external APIs, use custom JavaScript, or exceed <strong>100KB</strong> per column schema. For advanced scenarios requiring external data or complex logic, use <strong>SPFx Field Customizers</strong> instead.' },
            { question: 'Does column formatting work in Microsoft Lists?', answer: 'Yes. Microsoft Lists (both the standalone app and SharePoint-backed lists) fully support JSON column and view formatting. The same JSON schema works identically in both environments.' },
        ]
    },
    {
        name: 'CAML Query Builder',
        slug: 'caml-query-builder',
        description:
            'Construct XML CAML Queries visually for SharePoint REST APIs, PnP JS, CSOM, or SPFx. Add conditions, select fields, and generate the raw XML.',
        emoji: '🔍',
        tags: ['SharePoint', 'CAML', 'XML'],
        faqs: [
            { question: 'What is a CAML Query?', answer: '<strong>CAML</strong> (Collaborative Application Markup Language) is an XML-based query language used to filter, sort, and retrieve data from SharePoint lists and libraries. It\'s more powerful than OData $filter for complex queries involving nested AND/OR conditions, lookups, and managed metadata.' },
            { question: 'When should I use CAML instead of OData $filter?', answer: 'Use CAML when you need: <strong>nested AND/OR logic</strong>, <strong>lookup column filtering</strong>, <strong>managed metadata queries</strong>, <strong>Contains/BeginsWith operators</strong>, or <strong>recursive folder queries</strong>. OData $filter is simpler but cannot handle these advanced scenarios.' },
            { question: 'Can I use CAML with the SharePoint REST API?', answer: 'Yes! Send a <strong>POST request</strong> to <code>/_api/web/lists/getbytitle(\'ListName\')/GetItems</code> with a CAML query in the request body. The Content-Type must be <code>application/json;odata=verbose</code>.' },
            { question: 'Why use a visual CAML builder?', answer: 'Hand-writing CAML XML is <strong>extremely error-prone</strong>. A single misplaced tag (<code>&lt;Eq&gt;</code>, <code>&lt;FieldRef&gt;</code>, <code>&lt;Value&gt;</code>) will silently return wrong results or throw cryptic SharePoint errors. This builder ensures your nodes are perfectly nested and formatted.' },
            { question: 'What CAML operators are available?', answer: 'CAML supports: <strong>Eq</strong> (equals), <strong>Neq</strong> (not equals), <strong>Gt/Geq</strong> (greater than), <strong>Lt/Leq</strong> (less than), <strong>Contains</strong>, <strong>BeginsWith</strong>, <strong>IsNull/IsNotNull</strong>, <strong>In</strong> (multiple values), and <strong>DateRangesOverlap</strong> for calendar queries.' },
            { question: 'How do I filter by lookup columns in CAML?', answer: 'Use <code>&lt;FieldRef Name="LookupColumn" LookupId="TRUE" /&gt;</code> with the lookup ID value. This is one area where CAML is <strong>superior to OData</strong>, which struggles with complex lookup filtering.' },
            { question: 'Does CAML work with PnP.js?', answer: 'Yes. PnP.js provides a <code>.getItemsByCAMLQuery()</code> method that accepts a CAML query string. It handles the REST API call and JSON parsing for you, making it the cleanest approach for SPFx web parts.' },
        ]
    },
    {
        name: 'Permission Matrix Generator',
        slug: 'permission-matrix',
        description:
            'Visualize and generate SharePoint permission matrices across sites, libraries, and lists. Export as CSV or Markdown for audits and compliance.',
        emoji: '🛡️',
        tags: ['SharePoint', 'Permissions', 'Security'],
        faqs: [
            { question: 'What is a SharePoint permission matrix?', answer: 'A permission matrix is a <strong>grid that maps users and groups</strong> to the specific access levels (Read, Contribute, Edit, Full Control) they have across different SharePoint resources — sites, libraries, lists, and folders. It provides a clear, auditable overview of who can access what.' },
            { question: 'Why is auditing SharePoint permissions important?', answer: 'Regular audits prevent <strong>data leaks</strong>, ensure <strong>regulatory compliance</strong> (GDPR, SOX, HIPAA), and verify that only authorized personnel have access to sensitive enterprise documents. Many organizations are required to produce permission reports during annual security audits.' },
            { question: 'Can I export the permission matrix?', answer: 'Yes. This tool lets you export the generated matrix as a <strong>Markdown table</strong> (for documentation in Wikis or GitHub) or as a <strong>CSV file</strong> (for Excel analysis and compliance reporting).' },
            { question: 'What are the default SharePoint permission levels?', answer: 'SharePoint includes several built-in permission levels: <strong>Full Control</strong> (site owner), <strong>Design</strong> (customize pages), <strong>Edit</strong> (add/edit/delete items), <strong>Contribute</strong> (add/edit items but not delete lists), <strong>Read</strong> (view only), and <strong>Limited Access</strong> (automatically assigned when sharing individual items).' },
            { question: 'How do broken inheritance and unique permissions work?', answer: 'By default, SharePoint items <strong>inherit permissions</strong> from their parent (folder → library → site). When you "break inheritance," you create <strong>unique permissions</strong> for that item. This is useful for restricted documents but can create management complexity if overused.' },
            { question: 'What is the principle of least privilege in SharePoint?', answer: 'The <strong>principle of least privilege</strong> means granting users the <strong>minimum level of access</strong> they need to do their job. For example, don\'t give "Full Control" when "Contribute" suffices. This reduces risk and is a requirement for most security frameworks.' },
            { question: 'How do I check permissions for a specific user?', answer: 'In SharePoint, go to <strong>Site Settings → Site Permissions → Check Permissions</strong> and enter the user\'s name. SharePoint will show all permission levels granted through direct assignments and group memberships.' },
        ]
    },
    {
        name: 'REST API Builder',
        slug: 'rest-api-builder',
        description:
            'Build SharePoint REST API URLs visually — pick operations, add OData filters, and get code snippets in JavaScript, PnPjs, and PowerShell.',
        emoji: '⚡',
        tags: ['SharePoint', 'REST API', 'OData'],
        faqs: [
            { question: 'What is the SharePoint REST API?', answer: 'The SharePoint REST API allows developers to interact with SharePoint data remotely using <strong>standard HTTP requests</strong> (GET, POST, PATCH, DELETE). Any language or platform that can make HTTP calls — JavaScript, Python, PowerShell, Power Automate — can use it.' },
            { question: 'Which OData query parameters does SharePoint support?', answer: 'SharePoint supports: <strong>$select</strong> (choose columns), <strong>$filter</strong> (filter rows), <strong>$expand</strong> (include lookups), <strong>$orderby</strong> (sort), <strong>$top</strong> (limit results), and <strong>$skip</strong> (pagination). Note: $skip does not work with list items — use <code>$skiptoken</code> instead.' },
            { question: 'What is the request digest and why do I need it?', answer: 'The <strong>X-RequestDigest</strong> header is a security token required for all POST/PATCH/DELETE requests to prevent cross-site request forgery (CSRF). Get it from <code>/_api/contextinfo</code> or use the <code>__REQUESTDIGEST</code> hidden field in classic SharePoint pages.' },
            { question: 'How do I expand lookup columns in REST calls?', answer: 'Use <code>$expand=LookupColumn&$select=LookupColumn/Title,LookupColumn/Id</code>. You must use the <strong>internal name</strong> of the lookup column (check via <code>/_api/web/lists/getbytitle(\'List\')/fields</code>). Multi-value lookups require the same syntax.' },
            { question: 'What is the 5000 item threshold?', answer: 'SharePoint REST API returns a <strong>maximum of 5000 items</strong> per query. For lists with more items, you must use pagination via the <code>@odata.nextLink</code> URL or index your columns. Views with more than 5000 unindexed items will also fail.' },
            { question: 'Does this tool generate PnPjs code?', answer: 'Yes. The builder outputs code snippets for: <strong>raw fetch()</strong>, <strong>jQuery AJAX</strong>, <strong>@pnp/sp (PnPjs)</strong>, and <strong>PnP PowerShell</strong>. Each snippet includes proper headers, authentication patterns, and error handling.' },
            { question: 'How do I handle large file uploads via REST?', answer: 'For files under 250MB, use the <strong>chunked upload API</strong>: start with <code>StartUpload</code>, send chunks via <code>ContinueUpload</code>, and finish with <code>FinishUpload</code>. For files under 4MB, the simpler <code>Add</code> endpoint works.' },
        ]
    },
    {
        name: 'Site Script Generator',
        slug: 'site-script-generator',
        description:
            'Build SharePoint site scripts visually — add provisioning actions and export JSON with PowerShell deployment commands.',
        emoji: '🏗️',
        tags: ['SharePoint', 'Provisioning', 'JSON'],
        faqs: [
            { question: 'What are SharePoint Site Scripts?', answer: 'Site Scripts are <strong>JSON files</strong> that define a set of provisioning actions (creating lists, applying themes, setting navigation, adding site columns) that run automatically when a new SharePoint site is created or when manually applied to an existing site.' },
            { question: 'How do I deploy a site script?', answer: 'Use PowerShell: <strong>(1)</strong> Upload the JSON with <code>Add-SPOSiteScript</code>, <strong>(2)</strong> Bundle it into a Site Design with <code>Add-SPOSiteDesign</code>, <strong>(3)</strong> Users select it when creating a new site, or you apply it to existing sites with <code>Invoke-SPOSiteDesign</code>.' },
            { question: 'What actions can a site script perform?', answer: 'Site scripts support: <strong>creating lists/libraries</strong>, <strong>adding site columns</strong>, <strong>applying themes</strong>, <strong>setting the site logo/header</strong>, <strong>installing SPFx solutions</strong>, <strong>configuring navigation</strong>, <strong>enabling site features</strong>, and <strong>triggering Power Automate flows</strong> for complex provisioning.' },
            { question: 'Are site scripts better than PnP provisioning templates?', answer: 'Site scripts are <strong>lightweight, natively integrated</strong> into the SharePoint UI, and maintained by Microsoft — ideal for standardizing new sites. PnP provisioning templates are more powerful for <strong>complex scenarios</strong> (content types, term sets, full site cloning) but require PowerShell execution.' },
            { question: 'What are the limits of site scripts?', answer: 'A single site script is limited to <strong>300 actions</strong> and <strong>100KB</strong> file size. A site design can reference up to <strong>9 site scripts</strong>. Scripts run asynchronously and may take several minutes to complete on large sites.' },
            { question: 'Can site scripts trigger Power Automate flows?', answer: 'Yes! Use the <code>triggerFlow</code> action to call a Power Automate flow with an HTTP trigger. This is extremely powerful — it lets you perform actions that site scripts cannot do natively, like creating Teams channels, setting permissions, or sending notifications.' },
            { question: 'Do site scripts work with Teams-connected sites?', answer: 'Yes. When a Microsoft Teams team is created, it provisions a <strong>SharePoint team site</strong> behind it. You can apply site scripts to these sites to standardize document libraries, add custom lists, or apply branding automatically for every new team.' },
        ]
    },
    {
        name: 'PnP PowerShell Generator',
        slug: 'pnp-script-generator',
        description:
            'Generate ready-to-run PnP PowerShell scripts for SharePoint Online — lists, permissions, bulk operations, and more.',
        emoji: '🔧',
        tags: ['PowerShell', 'PnP', 'Automation'],
        faqs: [
            { question: 'What is PnP PowerShell?', answer: '<strong>PnP PowerShell</strong> is a cross-platform PowerShell module providing 500+ cmdlets tailored for Microsoft 365 and SharePoint Online administration. It is maintained by the Microsoft 365 & Power Platform community and is the de facto standard for SharePoint automation.' },
            { question: 'How do I install PnP PowerShell?', answer: 'Run <code>Install-Module PnP.PowerShell -Scope CurrentUser</code> in PowerShell 7+. For the first connection, run <code>Register-PnPManagementShellAccess</code> to consent to the required Azure AD permissions. Then connect with <code>Connect-PnPOnline -Url https://tenant.sharepoint.com -Interactive</code>.' },
            { question: 'Can I use PnP PowerShell with Azure Automation?', answer: 'Yes. Upload the PnP.PowerShell module to your Azure Automation account, create a <strong>managed identity</strong> or certificate-based app registration, and use <code>Connect-PnPOnline -ManagedIdentity</code> in your runbook. This enables fully unattended SharePoint automation.' },
            { question: 'What is the difference between PnP PowerShell and SharePoint Management Shell?', answer: 'The <strong>SharePoint Management Shell</strong> (SPO module) handles tenant-level admin tasks (site creation, storage quotas). <strong>PnP PowerShell</strong> covers everything the SPO module does <em>plus</em> site-level operations (list management, file operations, permissions, web parts). PnP is the recommended choice.' },
            { question: 'How do I bulk upload files with PnP PowerShell?', answer: 'Use <code>Get-ChildItem -Recurse | ForEach-Object { Add-PnPFile -Path $_.FullName -Folder "Shared Documents" }</code>. For large files (>250MB), PnP automatically switches to chunked upload. Add <code>-Values @{Title="..."; Category="..."}</code> to set metadata during upload.' },
            { question: 'Can PnP PowerShell manage Microsoft Teams?', answer: 'Yes. PnP PowerShell includes Teams cmdlets like <code>New-PnPTeamsTeam</code>, <code>Add-PnPTeamsChannel</code>, <code>Add-PnPTeamsUser</code>, and <code>Submit-PnPTeamsChannelMessage</code>. It can also manage the underlying SharePoint site connected to each team.' },
            { question: 'How do I handle authentication for scripts running on a schedule?', answer: 'For unattended scripts, use <strong>certificate-based authentication</strong>: <code>Connect-PnPOnline -Url $url -ClientId $appId -Tenant $tenant -CertificatePath $cert</code>. Register an Azure AD app with Sites.FullControl.All application permissions and upload a self-signed certificate.' },
        ]
    },
    {
        name: 'Power Automate Expressions',
        slug: 'power-automate-expressions',
        description:
            'Browse, search, and copy Power Automate expressions — with syntax, examples, and usage tips for every function.',
        emoji: '⚙️',
        tags: ['Power Automate', 'Expressions', 'Workflow'],
        faqs: [
            { question: 'What are Power Automate expressions?', answer: 'Expressions are <strong>formulas</strong> (similar to Excel) used in Power Automate flows to manipulate data, format dates, convert arrays, and handle conditional logic. They are entered in the "Expression" tab of the dynamic content pane within any action input.' },
            { question: 'Where do I type expressions in a flow?', answer: 'Click any input field in a flow action → the <strong>dynamic content pane</strong> appears → switch to the <strong>"Expression" tab</strong> → type or paste your formula → click "OK". The expression replaces the input field value.' },
            { question: 'Why does my expression return null?', answer: 'Common causes: <strong>(1)</strong> referencing a property that doesn\'t exist — use <code>coalesce()</code> for a fallback, <strong>(2)</strong> incorrect trigger/action reference name — check the "Outputs" of previous steps, <strong>(3)</strong> case sensitivity in property names — JSON properties are case-sensitive.' },
            { question: 'How do I format dates in Power Automate?', answer: 'Use <code>formatDateTime(triggerBody()?[\'DateField\'], \'yyyy-MM-dd\')</code>. Common format strings: <strong>yyyy-MM-dd</strong> (ISO), <strong>MM/dd/yyyy</strong> (US), <strong>dd-MMM-yyyy</strong> (e.g., "15-Jan-2026"). Always convert to UTC first with <code>convertTimeZone()</code> if working across time zones.' },
            { question: 'What is the difference between body() and triggerBody()?', answer: '<code><strong>triggerBody()</strong></code> returns the output of the flow\'s trigger (e.g., a SharePoint item or HTTP request body). <code><strong>body(\'ActionName\')</strong></code> returns the output of a specific action. Use <code>outputs(\'ActionName\')?[\'body\']</code> for more explicit referencing.' },
            { question: 'How do I handle arrays in expressions?', answer: 'Key array functions: <strong>length()</strong> for count, <strong>first()/last()</strong> for endpoints, <strong>contains()</strong> for searching, <strong>union()</strong> to merge, <strong>intersection()</strong> for common items, and <strong>join()</strong> to convert to a comma-separated string. Use <strong>Apply to Each</strong> for iteration.' },
            { question: 'Can I use if/else logic in expressions?', answer: 'Yes. Use the <code>if(condition, trueValue, falseValue)</code> function. For complex logic, nest them: <code>if(equals(x,1), "A", if(equals(x,2), "B", "C"))</code>. For flow-level branching, use the <strong>Condition</strong> or <strong>Switch</strong> action instead.' },
        ]
    },
    {
        name: 'Adaptive Card AI Generator',
        slug: 'adaptive-card-generator',
        description: 'Build and preview Adaptive Cards visually with JSON templates optimized for SPFx Viva Connections ACEs.',
        emoji: '🎴',
        tags: ['Adaptive Cards', 'SPFx', 'Viva'],
        faqs: [
            { question: 'What are Adaptive Cards?', answer: '<strong>Adaptive Cards</strong> are platform-agnostic snippets of UI, authored in JSON, that apps and services can openly exchange. They automatically adapt their rendering to the host application\'s (Teams, Outlook, Viva) visual style, ensuring a native look and feel.' },
            { question: 'How do I use Adaptive Cards in SPFx?', answer: 'In a <strong>Viva Connections Adaptive Card Extension (ACE)</strong>, paste the JSON into your template view files (<code>CardView.json</code>, <code>QuickView.json</code>). SPFx renders these cards in the Viva Connections dashboard, Teams, and SharePoint.' },
            { question: 'What Adaptive Card schema version should I use?', answer: 'Use <strong>schema version 1.5</strong> for maximum compatibility across Teams, Outlook, and Viva. Version 1.6 adds features like <code>Action.Execute</code> but has limited support in older clients. Always test in your target platform.' },
            { question: 'Can Adaptive Cards collect user input?', answer: 'Yes! Adaptive Cards support <strong>Input.Text</strong>, <strong>Input.Number</strong>, <strong>Input.Date</strong>, <strong>Input.Time</strong>, <strong>Input.Toggle</strong>, and <strong>Input.ChoiceSet</strong>. Combine with <code>Action.Submit</code> to send the form data back to your bot or flow.' },
            { question: 'Do Adaptive Cards work in Outlook emails?', answer: 'Yes. <strong>Actionable Messages</strong> in Outlook use Adaptive Cards. You can embed approval buttons, surveys, or quick actions directly in emails. Users interact without leaving their inbox. Requires registering with the Actionable Email Developer Dashboard.' },
            { question: 'What are the size limits for Adaptive Cards?', answer: 'The JSON payload must be under <strong>28KB</strong> for Teams and <strong>50KB</strong> for Outlook. Cards should render in under 200ms. Avoid deeply nested containers (>5 levels) and excessive image loading for best performance.' },
            { question: 'Can I create dynamic Adaptive Cards with data binding?', answer: 'Yes. Adaptive Cards support <strong>Adaptive Card Templating</strong> — separate your template (layout) from data (JSON object). Use <code>${property}</code> syntax to bind data dynamically, and the SDK merges them at runtime. This is ideal for displaying SharePoint list data.' },
        ]
    },
    {
        name: 'Power Automate HTML Table Styler',
        slug: 'html-table-styler',
        description:
            'Style SharePoint lists and Dataverse tables exported from Power Automate. Generate CSS for the "Create HTML table" action visually.',
        emoji: '🎨',
        tags: ['Power Automate', 'HTML Table', 'CSS', 'Styling'],
        faqs: [
            { question: 'How do I style an HTML table in Power Automate?', answer: 'The "Create HTML table" action outputs unstyled HTML. Add a <strong>Compose action</strong> before it containing your CSS wrapped in <code>&lt;style&gt;</code> tags. Then in your email body, concatenate: <code>concat(outputs(\'CSS_Compose\'), body(\'Create_HTML_table\'))</code>.' },
            { question: 'Why does my styled table look plain in Outlook?', answer: 'Outlook strips <code>&lt;style&gt;</code> tags from emails. You must use <strong>inline CSS</strong> instead: add styles directly to each HTML element using the <code>style="..."</code> attribute. This tool generates inline-compatible CSS that works in all email clients.' },
            { question: 'Can I add conditional formatting to the table?', answer: 'Yes, but not through CSS alone. Use an <strong>Apply to Each</strong> loop to iterate over rows, add a <strong>Condition</strong> action to check values, and dynamically inject different <code>style=""</code> attributes (e.g., red background for overdue items). This tool gives you the base CSS to start from.' },
            { question: 'Does this work with SharePoint list data?', answer: 'Yes. The most common pattern is: <strong>(1)</strong> "Get items" from a SharePoint list, <strong>(2)</strong> "Select" the columns you want, <strong>(3)</strong> "Create HTML table" from the selection, <strong>(4)</strong> Prepend CSS, <strong>(5)</strong> "Send an email" with the styled table in the body.' },
            { question: 'How do I make the table responsive for mobile?', answer: 'Email clients have limited CSS support. For mobile-friendly tables, set <code>width: 100%</code> on the table, use <code>word-wrap: break-word</code> on cells, and keep the number of columns to <strong>5 or fewer</strong>. Outlook on mobile automatically stacks tables that are too wide.' },
            { question: 'Can I add alternating row colors?', answer: 'Yes. Use the CSS <code>tr:nth-child(even) { background-color: #f8f9fa; }</code> selector. For inline CSS (Outlook-compatible), this tool generates the alternating styles directly on each row element.' },
            { question: 'Do I need to know CSS to use this tool?', answer: 'No. This generator lets you pick <strong>colors, borders, fonts, padding, and alignment</strong> visually using a point-and-click interface. It outputs the exact CSS string you need to copy and paste into your Power Automate Compose action.' },
        ]
    },
    {
        name: 'M365 Architecture Canvas',
        slug: 'm365-architecture-canvas',
        description:
            'Design Microsoft 365 architectures visually. Drag and drop SharePoint, Teams, and Power Platform components to generate a structured markdown document.',
        emoji: '🏗️',
        tags: ['Architecture', 'M365', 'Diagram'],
        faqs: [
            { question: 'What is the M365 Architecture Canvas used for?', answer: 'It allows <strong>architects, consultants, and developers</strong> to quickly draft Microsoft 365 technical solutions using a drag-and-drop interface. Instead of complex drawing tools like Visio, you get a structured Markdown document ready for proposals, documentation, or GitHub.' },
            { question: 'Which Microsoft 365 services are supported?', answer: 'You can add nodes for: <strong>SharePoint Online</strong> (sites, lists, libraries), <strong>Microsoft Teams</strong> (channels, tabs), <strong>Power Automate</strong> (flows), <strong>Power Apps</strong>, <strong>Microsoft Entra ID</strong> (formerly Azure AD), <strong>OneDrive</strong>, and <strong>Exchange Online</strong>.' },
            { question: 'Can I export the architecture diagram?', answer: 'Yes. The canvas automatically generates a <strong>professional Markdown document</strong> summarizing your architecture with component relationships, data flows, and integration points. Copy it directly into GitHub, Confluence, or a client proposal.' },
            { question: 'How do I represent data flows between services?', answer: 'Connect service nodes with arrows to represent data movement. For example: SharePoint → Power Automate → Teams shows an automated notification flow. Each connection can include a description of what data is transferred.' },
            { question: 'Is this a replacement for Microsoft Visio?', answer: 'Not entirely. This tool is designed for <strong>quick, text-based architecture documentation</strong> — ideal for proposals, sprint planning, and design reviews. For detailed, pixel-perfect diagrams with custom shapes and colors, Visio or draw.io are still better choices.' },
            { question: 'Can I use this for governance documentation?', answer: 'Absolutely. Use the canvas to map out your <strong>M365 governance model</strong>: site provisioning policies, Teams creation rules, data classification labels, and DLP policies. The Markdown output integrates perfectly into governance handbooks.' },
            { question: 'Does it support custom components or third-party services?', answer: 'Currently, the canvas focuses on <strong>core Microsoft 365 services</strong>. You can add generic "External System" nodes to represent third-party integrations like Salesforce, SAP, or custom APIs.' },
        ]
    },
    {
        name: 'SharePoint & Power Platform Error Decoder',
        slug: 'error-decoder',
        description:
            'Paste cryptic Microsoft 365 error codes or logs (like 0x80070005) to get instant human-readable translations, root causes, and fixes.',
        emoji: '🕵️‍♂️',
        tags: ['SharePoint', 'Power Automate', 'Troubleshooting', 'Errors'],
        faqs: [
            { question: 'What does the Error Decoder do?', answer: 'It translates <strong>confusing, hexadecimal, or generic error messages</strong> thrown by Microsoft 365 services into clear explanations of what went wrong, the root cause, and step-by-step fixes. No more Googling "0x80070005" or "The remote server returned an error: (403) Forbidden."' },
            { question: 'Which Microsoft 365 services are covered?', answer: 'The database includes common errors from: <strong>SharePoint Online</strong>, <strong>Power Automate</strong>, <strong>Power Apps</strong>, <strong>Microsoft Graph API</strong>, <strong>Microsoft Entra ID</strong>, <strong>Exchange Online</strong>, and <strong>PnP PowerShell</strong>.' },
            { question: 'Can I paste a full error log?', answer: 'Yes! Paste the <strong>raw text, JSON response, or PowerShell error output</strong>. The decoder scans the entire text for known error codes, HTTP status codes, and keywords to find a match. It handles correlation IDs, stack traces, and nested error objects.' },
            { question: 'What does error 0x80070005 mean?', answer: 'Error <strong>0x80070005</strong> is "Access Denied" — the most common SharePoint error. It means the user or app does not have sufficient permissions. Root causes include: broken inheritance, missing API permissions in Azure AD, or the user not being in the correct SharePoint group.' },
            { question: 'What does HTTP 429 mean in Microsoft Graph?', answer: 'HTTP 429 means <strong>"Too Many Requests"</strong> — you\'ve hit Microsoft Graph\'s throttling limit. The response includes a <code>Retry-After</code> header. Implement <strong>exponential backoff</strong>: wait the specified seconds, then retry. Batch requests using <code>$batch</code> to reduce call volume.' },
            { question: 'Why do I get "The attempted operation is prohibited because it exceeds the list view threshold"?', answer: 'This error occurs when a SharePoint list query tries to return or filter more than <strong>5000 items</strong> without an indexed column. Fix: <strong>(1)</strong> add an index to your filter column, <strong>(2)</strong> narrow your query with additional filters, or <strong>(3)</strong> use CAML with <code>RowLimit</code>.' },
            { question: 'What does "The security validation for this page is invalid" mean?', answer: 'This error means the <strong>Form Digest / Request Digest</strong> has expired (default: 30 minutes). Get a fresh digest from <code>/_api/contextinfo</code> before making POST/PATCH/DELETE calls. In SPFx, the framework handles this automatically.' },
        ]
    },
    {
        name: 'Graph API Explorer Lite',
        slug: 'graph-api-explorer',
        description:
            'An interactive, no-auth sandbox to explore popular Microsoft Graph API endpoints. Instantly view required permissions and realistic mock JSON responses.',
        emoji: '🎮',
        tags: ['Microsoft Graph', 'API', 'Developer Tools', 'Permissions'],
        faqs: [
            { question: 'Do I need to sign in to use this tool?', answer: 'No! This is a <strong>"Lite" mock version</strong> designed for quick reference without authenticating or setting up an Azure AD app. Browse endpoints, view required permissions, and see realistic JSON responses instantly.' },
            { question: 'Are these real API responses?', answer: 'They are <strong>realistic mock responses</strong> modeled exactly after the official Microsoft Graph API v1.0 documentation. The data structure, property names, and response format match what you\'d get from a real API call.' },
            { question: 'What is the difference between Delegated and Application permissions?', answer: '<strong>Delegated permissions</strong> act on behalf of a signed-in user — the app can only access what the user can access. <strong>Application permissions</strong> act as a background service with tenant-wide access. Application permissions are more powerful but require admin consent.' },
            { question: 'What is Microsoft Graph API?', answer: 'Microsoft Graph is the <strong>unified API gateway</strong> to all Microsoft 365 services. A single endpoint (<code>https://graph.microsoft.com</code>) provides access to users, mail, calendar, files (OneDrive/SharePoint), Teams, Planner, and 40+ other services.' },
            { question: 'How do I register an app for Graph API access?', answer: 'Go to <strong>Azure AD → App registrations → New registration</strong>. Set a redirect URI, then go to <strong>API permissions → Add a permission → Microsoft Graph</strong>. Select the required permissions (Delegated or Application) and grant admin consent if needed.' },
            { question: 'What are the most commonly used Graph endpoints?', answer: 'The most popular endpoints: <code>/me</code> (current user), <code>/users</code> (all users), <code>/me/messages</code> (emails), <code>/me/events</code> (calendar), <code>/groups</code> (M365 Groups/Teams), <code>/sites/{id}/lists</code> (SharePoint), and <code>/me/drive/root/children</code> (OneDrive files).' },
            { question: 'How do I handle pagination in Graph API?', answer: 'Graph returns a <code>@odata.nextLink</code> URL when there are more results. Keep making GET requests to the nextLink URL until it\'s no longer present. Default page size varies (10-100 items). Use <code>$top</code> to control page size, max is usually 999.' },
        ]
    },
    {
        name: 'M365 Challenge Mode',
        slug: 'm365-challenge',
        description:
            'Test your Microsoft 365, SharePoint, and Power Platform knowledge with this gamified developer quiz. Review detailed explanations after you finish!',
        emoji: '🏆',
        tags: ['Quiz', 'SharePoint', 'Power Platform', 'SPFx'],
        faqs: [
            { question: 'What topics are covered in the M365 Challenge?', answer: 'The question bank features <strong>intermediate to advanced topics</strong> across: SharePoint Framework (SPFx), Power Automate expressions and connectors, Microsoft Graph API permissions, SharePoint administration, Teams development, and general M365 architecture decisions.' },
            { question: 'Are the questions based on real-world scenarios?', answer: 'Yes. Every question is based on <strong>common architectural decisions, API quirks, and development scenarios</strong> you encounter in real M365 projects — from debugging SPFx builds to choosing the right Graph permission scope.' },
            { question: 'Do I get to see correct answers and explanations?', answer: 'Absolutely! At the end of the challenge, you get a <strong>full review screen</strong> with: the correct answer highlighted, a detailed explanation of <em>why</em> it\'s correct, and why the other options are wrong. This makes it a genuine learning tool.' },
            { question: 'How many questions are in the quiz?', answer: 'The current question bank contains <strong>25+ questions</strong> across multiple difficulty levels. Each session presents a randomized selection so you get a different experience each time you play.' },
            { question: 'Is this useful for Microsoft certification prep?', answer: 'While not a direct certification practice test, the questions cover topics that overlap with <strong>MS-600 (M365 Developer)</strong>, <strong>PL-400 (Power Platform Developer)</strong>, and <strong>MS-700 (Teams Administrator)</strong> exam objectives.' },
            { question: 'Can I share my score?', answer: 'Yes! After completing the challenge, you can share your score and badge on social media. It\'s a fun way to benchmark your M365 knowledge against peers and showcase your expertise.' },
            { question: 'Will more questions be added?', answer: 'Yes. The question bank is continuously expanded with new topics as Microsoft releases updates to SharePoint, Teams, Copilot, and the Power Platform. Check back regularly for fresh challenges.' },
        ]
    }
]
