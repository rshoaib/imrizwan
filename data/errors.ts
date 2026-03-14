export interface M365Error {
  id: string
  code: string
  title: string
  service: 'SharePoint' | 'Power Automate' | 'Power Apps' | 'Graph API' | 'Entra ID'
  description: string
  rootCause: string
  solution: string[]
  matchKeywords: string[]
}

export const m365Errors: M365Error[] = [
  {
    id: 'spo-429',
    code: '429',
    title: 'Too Many Requests (Throttling)',
    service: 'SharePoint',
    description: 'SharePoint has received too many requests from your account or tenant in a short period.',
    rootCause: 'You hit the SharePoint Online API usage limits. This often happens during bulk migrations, poorly optimized Power Automate loops, or aggressive SPFx API calls.',
    solution: [
      'Implement exponential backoff in your code (wait and retry).',
      'If using Power Automate, check the flow for "Apply to each" loops without concurrency control.',
      'Batch your REST API requests where possible.'
    ],
    matchKeywords: ['429', 'too many requests', 'throttled', 'sharepoint throttling']
  },
  {
    id: 'pa-branching',
    code: 'ActionBranchingConditionNotSatisfied',
    title: 'Action Branching Condition Not Satisfied',
    service: 'Power Automate',
    description: 'Your flow execution skipped an action because the condition preceding it evaluated to false.',
    rootCause: 'This is usually an expected behavior indicating a "Condition" action (If Yes / If No) routed the flow away from the action you were looking at.',
    solution: [
      'Check the run history of the flow.',
      'Look at the immediately preceding Condition action to see why it evaluated to false.',
      'Verify the data types in your condition (e.g., comparing a string "10" to an integer 10 will fail).'
    ],
    matchKeywords: ['actionbranchingconditionnotsatisfied', 'branching', 'condition not satisfied', 'skipped']
  },
  {
    id: 'sp-0x80070005',
    code: '0x80070005',
    title: 'Access Denied',
    service: 'SharePoint',
    description: 'You do not have the required permissions to perform the requested operation on the SharePoint resource.',
    rootCause: 'The user account or App Principal executing the request lacks Read, Write, or Full Control permissions on the specific Item, List, or Web.',
    solution: [
      'Verify the user permissions using the SharePoint "Check Permissions" ribbon button.',
      'If using an App-Only token, ensure the Azure AD app has Sites.ReadWrite.All or the specific site scopes.',
      'Check if the item has unique permissions (broken inheritance).'
    ],
    matchKeywords: ['0x80070005', 'access denied', 'unauthorized', 'permissions']
  },
  {
    id: 'pa-primitive',
    code: 'InvalidTemplate',
    title: 'Cannot Convert Primitive Value',
    service: 'Power Automate',
    description: 'The template validation failed: "Cannot convert a primitive value to the expected type \'Object\'".',
    rootCause: 'You passed a simple string or number to an action input that requires a JSON object or array.',
    solution: [
      'Check if you are passing a JSON string instead of an actual JSON object. Use the json() expression to parse it.',
      'Ensure the dynamic content you selected is an Object, not a String property.'
    ],
    matchKeywords: ['primitive value', 'expected type \'object\'', 'cannot convert', 'invalidtemplate']
  },
  {
    id: 'papps-delegation',
    code: 'Delegation Warning',
    title: 'Blue Underline Delegation Warning',
    service: 'Power Apps',
    description: 'A blue underline appears under a formula with a delegation warning.',
    rootCause: 'The formula contains a function (like Search() or complex Filters) that the data source (like SharePoint) cannot process on the server side. Power Apps will only download the first 500 records (by default) and process the formula locally.',
    solution: [
      'Rewrite the Filter() to use delegable operators like "=" or "StartsWith()".',
      'For SharePoint, avoid the "in", "Not", and complex logical operator groupings when dealing with large lists.',
      'If the dataset is relatively small, you can increase the data row limit to 2000 in App settings.'
    ],
    matchKeywords: ['delegation', 'blue underline', 'search sharepoint', 'limit']
  },
  {
    id: 'graph-itemnotfound',
    code: 'itemNotFound',
    title: 'Item Not Found',
    service: 'Graph API',
    description: 'The resource could not be found.',
    rootCause: 'The ID provided for the user, group, site, list, or item does not exist, or the authenticated app does not have permission to see that it exists.',
    solution: [
      'Double-check the resource ID in your Graph URL.',
      'If you are absolutely sure the ID is correct, you likely have a permission scope issue. Graph returns 404 instead of 403 for some resources to prevent enumeration attacks.',
      'Ensure your Azure AD app has the correct Application permissions (e.g., User.Read.All).'
    ],
    matchKeywords: ['itemnotfound', '404', 'resource could not be found']
  },
  {
    id: 'spo-versionconflict',
    code: 'ItemConflict',
    title: 'Save Conflict',
    service: 'SharePoint',
    description: 'Your changes conflict with those made concurrently by another user (or workflow).',
    rootCause: 'You tried to update a SharePoint list item (via UI, REST, or Power Automate) but the item was modified by someone else since you first loaded it.',
    solution: [
      'In code, fetch the latest item metadata and ETag before submitting the HTTP PATCH request.',
      'In Power Automate, add a delay or retry policy, as another flow might be simultaneously updating the same item.'
    ],
    matchKeywords: ['save conflict', 'itemconflict', 'concurrently', 'etag']
  },
  {
    id: 'pa-badgateway',
    code: '502',
    title: 'Bad Gateway',
    service: 'Power Automate',
    description: 'The flow action failed with a 502 Bad Gateway error.',
    rootCause: 'The target service (e.g., SharePoint, SQL Server, custom API) took too long to respond, or the connector infrastructure experienced a temporary hiccup.',
    solution: [
      'This is often transient. Configure a Retry Policy in the action settings (Settings > Retry Policy).',
      'If querying a database or large SharePoint list, ensure the query is indexed and optimized so it returns faster.'
    ],
    matchKeywords: ['502', 'bad gateway', 'timeout', 'transient']
  },
  {
    id: 'papps-patch',
    code: 'Network Error',
    title: 'Network error when using Patch function',
    service: 'Power Apps',
    description: 'Network error when using Patch function: "The requested operation is invalid".',
    rootCause: 'You are attempting to Patch a record but providing an invalid data structure, missing a required field, or providing a text value to a Lookup/Choice column without the correct object format.',
    solution: [
      'For Choice columns, supply the structured record: { Value: "My Choice", \'@odata.type\': "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference" }.',
      'For Lookup columns, provide the Id and Value.',
      'Ensure all required fields in the data source are included if creating a new record.'
    ],
    matchKeywords: ['patch', 'network error', 'requested operation is invalid', 'choice column']
  },
  {
    id: 'entra-aadsts50011',
    code: 'AADSTS50011',
    title: 'Reply URL Mismatch',
    service: 'Entra ID',
    description: 'The reply URL specified in the request does not match the reply URLs configured for the application.',
    rootCause: 'The redirect_uri passed by your application (e.g., in MSAL or SPFx) during login does not exactly match any of the Redirect URIs registered in the Azure Portal for that App ID.',
    solution: [
      'Go to the Azure Portal > Microsoft Entra ID > App Registrations > [Your App] > Authentication.',
      'Add the exact URL (including trailing slashes and http/https) your app is running from to the Redirect URIs list.',
      'Wait a few minutes for the change to propagate.'
    ],
    matchKeywords: ['aadsts50011', 'reply url', 'redirect_uri', 'does not match']
  }
]
