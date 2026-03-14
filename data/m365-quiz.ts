export type QuizDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type QuizCategory = 'SharePoint' | 'Power Platform' | 'M365 Development' | 'SPFx'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
  category: QuizCategory
  difficulty: QuizDifficulty
}

export const m365QuizBank: QuizQuestion[] = [
  // SPFx
  {
    id: 'spfx-1',
    category: 'SPFx',
    difficulty: 'Intermediate',
    question: 'Which toolchain is primarily used to build SharePoint Framework (SPFx) client-side web parts?',
    options: [
      'Visual Studio with C#',
      'Node.js, Yeoman, and Gulp',
      'Python and Django',
      'PHP and Apache'
    ],
    correctAnswerIndex: 1,
    explanation: 'SPFx utilizes a modern web toolchain based on Node.js. Developers use Yeoman templates to scaffold projects and Gulp tasks to build, serve, and package the solutions.'
  },
  {
    id: 'spfx-2',
    category: 'SPFx',
    difficulty: 'Advanced',
    question: 'In an SPFx web part, what is the purpose of the `render` method in the main `BaseClientSideWebPart` class?',
    options: [
      'To define the properties pane configuration.',
      'To construct the HTML or mount the React component inside the web part DOM element.',
      'To fetch data from SharePoint lists.',
      'To initialize context variables.'
    ],
    correctAnswerIndex: 1,
    explanation: 'The `render()` method receives the DOM element (`this.domElement`) allocated to the web part by SharePoint. It is the mandatory method where developers must inject their HTML or mount their front-end framework (like React).'
  },
  
  // Power Platform
  {
    id: 'pp-1',
    category: 'Power Platform',
    difficulty: 'Beginner',
    question: 'When building a Power Automate flow, what terminates a \"Do until\" loop?',
    options: [
      'A predefined time limit only.',
      'A condition that evaluates to True or timeout/iteration limits.',
      'When the user manually clicks "Stop".',
      'When it runs out of premium API calls.'
    ],
    correctAnswerIndex: 1,
    explanation: 'A "Do until" loop in Power Automate executes actions until the specified condition evaluates to true, OR it hits the configured timeout limit or iteration count limit (default is PT1H or 60 iterations).'
  },
  {
    id: 'pp-2',
    category: 'Power Platform',
    difficulty: 'Intermediate',
    question: 'In Power Apps, which function is used to securely patch an existing record while avoiding delegation warnings on large datasets?',
    options: [
      'UpdateIf()',
      'SubmitForm()',
      'Patch()',
      'Filter()'
    ],
    correctAnswerIndex: 2,
    explanation: 'The `Patch()` function combined with a specific record reference (e.g., using `LookUp` to find the item) allows you to update specific fields of a specific record. While `UpdateIf` handles multiple records, it often triggers delegation warnings on non-delegable data sources if used with complex conditions.'
  },

  // SharePoint
  {
    id: 'sp-1',
    category: 'SharePoint',
    difficulty: 'Beginner',
    question: 'What is the maximum file size limit for a single file uploaded to SharePoint Online (as of 2024/2025)?',
    options: [
      '15 GB',
      '50 GB',
      '100 GB',
      '250 GB'
    ],
    correctAnswerIndex: 3,
    explanation: 'Microsoft increased the maximum individual file upload size for SharePoint Online, OneDrive, and Teams to 250 GB.'
  },
  {
    id: 'sp-2',
    category: 'SharePoint',
    difficulty: 'Intermediate',
    question: 'When formatting a SharePoint list column using JSON, which property is used to dynamically reference the value of the current field?',
    options: [
      '@currentField',
      '[$FieldName]',
      '@me',
      '@now'
    ],
    correctAnswerIndex: 0,
    explanation: 'In JSON column formatting, `@currentField` evaluates to the value of the specific field being formatted. To reference a *different* column in the same row, you would use `[$InternalColumnName]`.'
  },

  // M365 Development
  {
    id: 'm365-1',
    category: 'M365 Development',
    difficulty: 'Advanced',
    question: 'When registering an Entra ID (Azure AD) application to consume Microsoft Graph headless (e.g., via a daemon process), which authentication flow should you use?',
    options: [
      'Authorization Code Flow',
      'Implicit Grant Flow',
      'Client Credentials Flow',
      'Device Code Flow'
    ],
    correctAnswerIndex: 2,
    explanation: 'The Client Credentials flow is designed for server-to-server interactions where no user is present. The daemon authenticates using its own application identity (Client ID and Secret/Certificate) rather than a delegated user identity.'
  },
  {
    id: 'm365-2',
    category: 'M365 Development',
    difficulty: 'Intermediate',
    question: 'Which Microsoft Graph API permissions type requires user consent (or admin consent on behalf of a user) before an app can act as the signed-in user?',
    options: [
      'Application Permissions',
      'Delegated Permissions',
      'Service Principal Permissions',
      'Tenant Permissions'
    ],
    correctAnswerIndex: 1,
    explanation: 'Delegated permissions are used by apps that have a signed-in user present. The app acts on behalf of the user, meaning it can only access data the user themselves has permissions to access.'
  },
  {
    id: 'm365-3',
    category: 'M365 Development',
    difficulty: 'Intermediate',
    question: 'What is PnP PowerShell?',
    options: [
      'A proprietary Microsoft tool replacing the SPOMT.',
      'An open-source, community-driven PowerShell module for managing Microsoft 365 environments.',
      'A physical device used to format drives for SharePoint servers.',
      'A node dependency exclusively for SPFx.'
    ],
    correctAnswerIndex: 1,
    explanation: 'PnP (Patterns and Practices) PowerShell is a cross-platform, open-source PowerShell module providing over 600 cmdlets that simplify administrative and developer tasks across SharePoint, Teams, Planner, and more.'
  },
  {
    id: 'sp-3',
    category: 'SharePoint',
    difficulty: 'Advanced',
    question: 'What does the CAML `<In>` operator do when querying a SharePoint list?',
    options: [
      'Checks if a text string contains a specific substring.',
      'Filters records where a field\'s value matches any value within a specified set array.',
      'Injects a new item into the list.',
      'Checks if the current user is in a specific SharePoint security group.'
    ],
    correctAnswerIndex: 1,
    explanation: 'The `<In>` operator in Collaborative Application Markup Language (CAML) evaluates whether the value of a specified field matches any of the values provided within a `<Values>` element (similar to SQL IN clause).'
  }
]
