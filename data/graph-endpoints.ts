export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface GraphEndpointData {
  id: string;
  category: string;
  method: HttpMethod;
  endpoint: string;
  description: string;
  delegatedPermissions: string[];
  applicationPermissions: string[];
  mockResponse: object;
}

export const graphEndpoints: GraphEndpointData[] = [
  // User Endpoints
  {
    id: "get-my-profile",
    category: "Users",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/me",
    description: "Get the profile of the currently authenticated user.",
    delegatedPermissions: ["User.Read", "User.ReadWrite", "User.ReadBasic.All", "User.Read.All", "User.ReadWrite.All"],
    applicationPermissions: ["User.Read.All", "User.ReadWrite.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users/$entity",
      "businessPhones": ["+1 412 555 0109"],
      "displayName": "Megan Bowen",
      "givenName": "Megan",
      "jobTitle": "Auditor",
      "mail": "MeganB@contoso.OnMicrosoft.com",
      "mobilePhone": null,
      "officeLocation": "12/1110",
      "preferredLanguage": "en-US",
      "surname": "Bowen",
      "userPrincipalName": "MeganB@contoso.onmicrosoft.com",
      "id": "48d31887-5fad-4d73-a9f5-3c356e68a038"
    }
  },
  {
    id: "get-manager",
    category: "Users",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/me/manager",
    description: "Get the user's manager.",
    delegatedPermissions: ["User.Read.All", "User.ReadWrite.All", "Directory.Read.All", "Directory.ReadWrite.All"],
    applicationPermissions: ["User.Read.All", "User.ReadWrite.All", "Directory.Read.All", "Directory.ReadWrite.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryObjects/$entity",
      "@odata.type": "#microsoft.graph.user",
      "id": "e812b186-e6cc-46e3-a602-53b47dd7df41",
      "businessPhones": ["+1 425 555 0109"],
      "displayName": "Miriam Graham",
      "givenName": "Miriam",
      "jobTitle": "Director",
      "mail": "MiriamG@contoso.onmicrosoft.com"
    }
  },

  // Groups and Teams Endpoints
  {
    id: "list-groups",
    category: "Groups & Teams",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/groups",
    description: "List all groups in the organization.",
    delegatedPermissions: ["Group.Read.All", "Group.ReadWrite.All", "Directory.Read.All", "Directory.ReadWrite.All"],
    applicationPermissions: ["Group.Read.All", "Group.ReadWrite.All", "Directory.Read.All", "Directory.ReadWrite.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#groups",
      "value": [
        {
          "id": "02bd9fd6-8f93-4758-87c3-1fb73740a315",
          "deletedDateTime": null,
          "classification": null,
          "createdDateTime": "2023-01-01T00:00:00Z",
          "creationOptions": ["Team", "ExchangeProvisioningFlags:3552"],
          "description": "Marketing team discussion group",
          "displayName": "Marketing",
          "groupTypes": ["Unified"],
          "mail": "marketing@contoso.onmicrosoft.com",
          "mailEnabled": true,
          "mailNickname": "marketing",
          "securityEnabled": false
        }
      ]
    }
  },
  {
    id: "get-team-channels",
    category: "Groups & Teams",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/teams/{team-id}/channels",
    description: "Get the active channels for a specific team.",
    delegatedPermissions: ["Channel.ReadBasic.All", "Channel.Read.All", "Group.Read.All"],
    applicationPermissions: ["Channel.ReadBasic.All", "Channel.Read.All", "Group.Read.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#teams('02bd9fd6-8f93-4758-87c3-1fb73740a315')/channels",
      "@odata.count": 2,
      "value": [
        {
          "id": "19:d0bba23c28b3400a947be7f3d9d3056d@thread.skype",
          "displayName": "General",
          "description": "General channel for team-wide communication",
          "membershipType": "standard"
        },
        {
          "id": "19:1b52d91bb1614741b059341cbaa79bb0@thread.skype",
          "displayName": "Project Alpha",
          "description": "Discussions related to the new Project Alpha",
          "membershipType": "private"
        }
      ]
    }
  },

  // SharePoint Sites Endpoints
  {
    id: "get-root-site",
    category: "SharePoint & Sites",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/sites/root",
    description: "Get the root SharePoint site for the tenant.",
    delegatedPermissions: ["Sites.Read.All", "Sites.ReadWrite.All"],
    applicationPermissions: ["Sites.Read.All", "Sites.ReadWrite.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#sites/$entity",
      "createdDateTime": "2020-01-01T00:00:00Z",
      "description": "Contoso Intranet Root",
      "id": "contoso.sharepoint.com,1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d,7d8e9f0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
      "lastModifiedDateTime": "2023-05-15T12:00:00Z",
      "name": "root",
      "webUrl": "https://contoso.sharepoint.com",
      "displayName": "Communication Site",
      "siteCollection": {
        "hostname": "contoso.sharepoint.com"
      }
    }
  },
  {
    id: "get-site-lists",
    category: "SharePoint & Sites",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/sites/{site-id}/lists",
    description: "Get the collection of lists and document libraries for a site.",
    delegatedPermissions: ["Sites.Read.All", "Sites.ReadWrite.All"],
    applicationPermissions: ["Sites.Read.All", "Sites.ReadWrite.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#sites('contoso.sharepoint.com')/lists",
      "value": [
        {
          "id": "b0af8e8c-8433-41bb-a5eb-0f1be5c65f95",
          "name": "Documents",
          "displayName": "Shared Documents",
          "description": "Default document library for the site",
          "createdDateTime": "2020-01-01T00:00:00Z",
          "list": {
            "template": "documentLibrary",
            "hidden": false
          }
        },
        {
          "id": "c1bf9f9d-9544-52cc-b6fc-1g2cf6d76g06",
          "name": "Events",
          "displayName": "Team Events",
          "description": "Upcoming events calendar",
          "createdDateTime": "2020-02-01T00:00:00Z",
          "list": {
            "template": "events",
            "hidden": false
          }
        }
      ]
    }
  },

  // OneDrive Endpoints
  {
    id: "get-my-drive",
    category: "OneDrive",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/me/drive",
    description: "Get the authenticated user's default drive.",
    delegatedPermissions: ["Files.Read", "Files.ReadWrite", "Files.Read.All", "Files.ReadWrite.All"],
    applicationPermissions: ["Files.Read.All", "Files.ReadWrite.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#drives/$entity",
      "id": "b!1a2b3c...",
      "driveType": "business",
      "owner": {
        "user": {
          "email": "MeganB@contoso.OnMicrosoft.com",
          "displayName": "Megan Bowen",
          "id": "48d31887-5fad-4d73-a9f5-3c356e68a038"
        }
      },
      "quota": {
        "deleted": 12345,
        "remaining": 1099511627776,
        "state": "normal",
        "total": 1099511627776,
        "used": 4567890
      }
    }
  },
  {
    id: "get-recent-files",
    category: "OneDrive",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/me/drive/recent",
    description: "Get a collection of drive items that have been recently used by the user.",
    delegatedPermissions: ["Files.Read", "Files.ReadWrite", "Files.Read.All", "Files.ReadWrite.All"],
    applicationPermissions: ["Files.Read.All", "Files.ReadWrite.All"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#Collection(driveItem)",
      "value": [
        {
          "id": "01T2Z3...",
          "name": "Q3 Financials.xlsx",
          "file": {
            "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          },
          "lastModifiedDateTime": "2023-10-01T14:30:00Z",
          "size": 154323,
          "webUrl": "https://contoso-my.sharepoint.com/personal/meganb_contoso_com/Documents/Q3 Financials.xlsx"
        },
        {
          "id": "01T4Y5...",
          "name": "Project Proposal.docx",
          "file": {
            "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          },
          "lastModifiedDateTime": "2023-09-28T09:15:00Z",
          "size": 20485,
          "webUrl": "https://contoso-my.sharepoint.com/personal/meganb_contoso_com/Documents/Project Proposal.docx"
        }
      ]
    }
  },

  // Mail & Calendar Endpoints
  {
    id: "get-my-messages",
    category: "Mail & Calendar",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/me/messages",
    description: "Get the messages in the signed-in user's mailbox.",
    delegatedPermissions: ["Mail.Read", "Mail.ReadWrite", "Mail.ReadBasic"],
    applicationPermissions: ["Mail.Read", "Mail.ReadWrite"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('48d31887-5fad-4d73-a9f5-3c356e68a038')/messages",
      "value": [
        {
          "id": "AAMkAGI...",
          "receivedDateTime": "2023-11-01T08:00:00Z",
          "subject": "Weekly Team meeting notes",
          "sender": {
            "emailAddress": {
              "name": "Alex Wilber",
              "address": "AlexW@contoso.onmicrosoft.com"
            }
          },
          "isRead": false,
          "bodyPreview": "Hi team, here are the notes from yesterday's meeting..."
        }
      ]
    }
  },
  {
    id: "get-my-events",
    category: "Mail & Calendar",
    method: "GET",
    endpoint: "https://graph.microsoft.com/v1.0/me/events",
    description: "Get a list of events in the user's default calendar.",
    delegatedPermissions: ["Calendars.Read", "Calendars.ReadWrite"],
    applicationPermissions: ["Calendars.Read", "Calendars.ReadWrite"],
    mockResponse: {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('48d31887-5fad-4d73-a9f5-3c356e68a038')/events",
      "value": [
        {
          "id": "AAMkADJ...",
          "subject": "Project Sync",
          "start": {
            "dateTime": "2023-11-05T10:00:00.0000000",
            "timeZone": "Pacific Standard Time"
          },
          "end": {
            "dateTime": "2023-11-05T11:00:00.0000000",
            "timeZone": "Pacific Standard Time"
          },
          "location": {
            "displayName": "Teams Meeting"
          },
          "attendees": [
            {
              "type": "required",
              "status": {
                "response": "accepted",
                "time": "2023-11-02T14:00:00Z"
              },
              "emailAddress": {
                "name": "Adele Vance",
                "address": "AdeleV@contoso.onmicrosoft.com"
              }
            }
          ]
        }
      ]
    }
  }
];
