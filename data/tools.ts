export const tools = [
    {
        name: 'GUID / UUID Generator',
        slug: 'guid-generator',
        description:
            'Generate v4 UUIDs instantly for SPFx manifests, Azure AD registrations, Teams apps, and Power Platform solutions.',
        emoji: '🔑',
        tags: ['SPFx', 'Azure AD', 'Teams'],
        faqs: [
            { question: 'What is a GUID?', answer: 'A GUID (Globally Unique Identifier) is a 128-bit text string that represents an identification. In Microsoft ecosystems, it is heavily used to identify applications, resources, and components.' },
            { question: 'Why do I need a GUID for SPFx?', answer: 'SharePoint Framework (SPFx) web parts and extensions require a unique ID in their manifest.json file to register correctly in the App Catalog.' },
            { question: 'Are these GUIDs v4 compliant?', answer: 'Yes, this tool generates standard Version 4 UUIDs which are randomly generated and perfectly suited for Azure AD and Microsoft 365 development.' }
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
            { question: 'What is SharePoint JSON Column Formatting?', answer: 'It is a declarative way to customize how fields in SharePoint lists and libraries are displayed without altering the underlying data.' },
            { question: 'Where do I paste this JSON?', answer: 'In your SharePoint list, click the column header, select "Column settings" > "Format this column", and paste the JSON in the advanced mode editor.' },
            { question: 'Does this support Excel-style expressions?', answer: 'Yes, the templates use the modern v2 schema which supports Excel-style expressions (e.g., =if(@currentField > 10, "true", "false")).' }
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
            { question: 'What is a CAML Query?', answer: 'CAML (Collaborative Application Markup Language) is an XML-based query language used to filter, sort, and retrieve data from SharePoint lists and libraries.' },
            { question: 'Can I use CAML with the SharePoint REST API?', answer: 'Yes! You can pass a CAML query in a POST request to the GetItems endpoint to perform complex filtering that standard OData $filter does not support.' },
            { question: 'Why use this builder instead of writing XML?', answer: 'Hand-writing XML is error-prone. This builder ensures your nodes (<Eq>, <FieldRef>, <Value>) are perfectly nested and formatted.' }
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
            { question: 'What is a permission matrix?', answer: 'A permission matrix is a grid that maps users and groups to the specific access levels (Read, Contribute, Full Control) they have across different SharePoint resources.' },
            { question: 'Why is auditing SharePoint permissions important?', answer: 'Regular audits prevent data leaks, ensure compliance, and verify that only authorized personnel have access to sensitive enterprise documents.' },
            { question: 'Can I export the matrix?', answer: 'Yes, you can export the generated matrix as a Markdown table or CSV file for inclusion in your security reports.' }
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
            { question: 'What is the SharePoint REST API?', answer: 'The SharePoint REST API allows developers to interact with SharePoint data remotely using standard HTTP requests (GET, POST, PATCH, DELETE).' },
            { question: 'Which OData operators are supported?', answer: 'The API supports $select, $filter, $expand, $orderby, and $top to limit and shape the data returned by SharePoint.' },
            { question: 'Does this tool generate PnPjs code?', answer: 'Yes, the builder outputs snippets for raw fetch(), jQuery AJAX, PnPjs, and PnP PowerShell to match your preferred development stack.' }
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
            { question: 'What are SharePoint Site Scripts?', answer: 'Site Scripts are JSON files that define a set of actions (like creating lists or applying themes) that run when a new SharePoint site is provisioned.' },
            { question: 'How do I apply a site script?', answer: 'You bundle one or more Site Scripts into a Site Design (or Site Template) using the Add-SPOSiteDesign PowerShell cmdlet.' },
            { question: 'Are site scripts better than PnP provisioning?', answer: 'Site scripts are lightweight, natively integrated into the SharePoint UI, and maintained by Microsoft, making them ideal for standardizing new sites without complex code.' }
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
            { question: 'What is PnP PowerShell?', answer: 'PnP PowerShell is a cross-platform PowerShell module providing hundreds of cmdlets tailored for Microsoft 365 and SharePoint administration.' },
            { question: 'Do I need to authenticate?', answer: 'Yes, you must connect to your tenant using Connect-PnPOnline before executing the generated scripts. Interactive browser login or app-only auth are supported.' },
            { question: 'Can I use these scripts in Azure Automation?', answer: 'Absolutely. The generated scripts are standard PowerShell and can be pasted directly into Azure Automation runbooks with managed identities.' }
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
            { question: 'What are Power Automate expressions?', answer: 'Expressions are formulas (similar to Excel) used in Power Automate flows to manipulate data, format dates, convert arrays, and handle logic.' },
            { question: 'Where do I enter expressions in my flow?', answer: 'Click any input field in a flow action, switch to the "Expression" tab in the dynamic content pane, and paste your formula.' },
            { question: 'Why does my expression return null?', answer: 'If an expression references a missing property, it will return null. Use the coalesce() function to provide a fallback value.' }
        ]
    },
    {
        name: 'Adaptive Card AI Generator',
        slug: 'adaptive-card-generator',
        description: 'Build and preview Adaptive Cards visually with JSON templates optimized for SPFx Viva Connections ACEs.',
        emoji: '🎴',
        tags: ['Adaptive Cards', 'SPFx', 'Viva'],
        faqs: [
            { question: 'What are Adaptive Cards?', answer: 'Adaptive Cards are platform-agnostic snippets of UI, authored in JSON, that apps and services can openly exchange. They automatically adapt to the host\'s UX guidelines.' },
            { question: 'How do I use this in SPFx?', answer: 'You can use the JSON generated here directly in a Viva Connections Adaptive Card Extension (ACE) template view.' },
            { question: 'Does this generate C# code?', answer: 'No, this tool generates the declarative JSON payload that can be parsed by the AdaptiveCards SDK in any language, including the SPFx TypeScript runtime.' }
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
            { question: 'How do I style an HTML table in Power Automate?', answer: 'You can style the output of the "Create HTML table" action by adding custom CSS in a Compose action and placing it directly above the table output in your email or message.' },
            { question: 'Does this work with SharePoint data?', answer: 'Yes, this CSS works perfectly with SharePoint lists that have been converted to HTML tables using Power Automate.' },
            { question: 'Do I need to know CSS to use this?', answer: 'No. This generator lets you pick colors, borders, and fonts visually, and it outputs the exact CSS string you need to copy and paste.' }
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
            { question: 'What is this canvas used for?', answer: 'It allows architects and consultants to quickly draft M365 technical solutions using a drag-and-drop interface instead of complex drawing tools.' },
            { question: 'Can I export the design?', answer: 'Yes, the canvas automatically generates a professional Markdown document summarizing your architecture, ready to be pasted into GitHub or a proposal.' },
            { question: 'Which services are supported?', answer: 'Currently, you can add nodes for SharePoint, Teams, Power Automate, Power Apps, and Entra ID.' }
        ]
    }
]

