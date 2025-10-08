# Workflow System Documentation

This document describes the workflow system for the Document Management System. The frontend is already implemented and ready to connect to your backend API.

## Overview

The workflow system allows users to track document status changes, add comments, and assign tasks. It includes role-based permissions where:
- **Admins** can change status, assign users, and add comments
- **Document Owners** can only add comments (cannot change status or assignments)

## Frontend Components

### 1. Workflow Timeline Component
**Location:** `components/workflows/workflow-timeline.tsx`

Displays the workflow history for a specific document in a timeline format.

**Features:**
- Shows all workflow entries for a document
- Displays status badges with icons
- Shows who performed the action and who it's assigned to
- Displays comments and timestamps
- "Add Status" button to open the workflow action modal
- Auto-refreshes when new workflow entries are added

**Usage:**
\`\`\`tsx
<WorkflowTimeline 
  documentId="123" 
  onAddWorkflow={() => setIsWorkflowModalOpen(true)} 
/>
\`\`\`

### 2. Workflow Action Modal
**Location:** `components/workflows/workflow-action-modal.tsx`

Modal dialog for adding new workflow entries with role-based permissions.

**Features:**
- **For Admins:**
  - Change document status (Draft, In Review, Approved, Rejected)
  - Assign to users/teams
  - Add comments
- **For Document Owners:**
  - Add comments only
  - Cannot change status or assignments
- Form validation
- Loading states
- Error handling

**Usage:**
\`\`\`tsx
<WorkflowActionModal
  isOpen={isWorkflowModalOpen}
  onClose={() => setIsWorkflowModalOpen(false)}
  documentId="123"
  onWorkflowAdded={handleWorkflowAdded}
/>
\`\`\`

### 3. Workflow List Page
**Location:** `app/workflows/page.tsx`

Displays all workflow logs with advanced filtering.

**Features:**
- **For Admins:** View all workflows across all documents
- **For Document Owners:** View only workflows for their own documents
- Advanced filtering:
  - Search by document title, user, or comment
  - Filter by status
  - Filter by department (admin only)
  - Filter by date range
- Table view with sortable columns
- Role indicator badges

## Backend API Requirements

You need to implement these API endpoints on your backend:

### 1. GET /api/documents/{id}/
**Purpose:** Get document details including workflow history

**Response:**
\`\`\`json
{
  "id": 1,
  "title": "Project Proposal Q1 2024",
  "description": "Quarterly project proposal",
  "status": "Approved",
  "author": "John Doe",
  "department": "Finance",
  "type": "Proposal",
  "version": "1.0",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-18T16:45:00Z",
  "owner": "john.doe@company.com",
  "workflows": [
    {
      "id": 1,
      "status": "Draft",
      "action_by": "John Doe",
      "assigned_to": "Jane Smith",
      "comment": "Initial document creation",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

### 2. POST /api/workflows/
**Purpose:** Create a new workflow entry

**Request Headers:**
\`\`\`
Authorization: Bearer {token}
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "document": 1,
  "status": "In Review",
  "action_by": "Jane Smith",
  "assigned_to": "Legal Team",
  "comment": "Document submitted for legal review"
}
\`\`\`

**Validation Rules:**
- `document` (required): Document ID
- `status` (required for admins): One of ["Draft", "In Review", "Approved", "Rejected"]
- `action_by` (required): Name of user performing the action
- `assigned_to` (optional): Name of user/team assigned
- `comment` (optional, required for non-admins): Comment text

**Permission Rules:**
- **Admins:** Can set status, assigned_to, and comment
- **Document Owners:** Can only set comment (status and assigned_to should be ignored)
- **Others:** No permission to create workflow entries

**Response (201 Created):**
\`\`\`json
{
  "id": 5,
  "document": 1,
  "status": "In Review",
  "action_by": "Jane Smith",
  "assigned_to": "Legal Team",
  "comment": "Document submitted for legal review",
  "created_at": "2024-01-19T10:30:00Z",
  "document_title": "Project Proposal Q1 2024",
  "document_owner": "john.doe@company.com",
  "department": "Finance"
}
\`\`\`

### 3. GET /api/workflows/
**Purpose:** Get workflow logs with filtering

**Query Parameters:**
- `document` (optional): Filter by document ID
- `status` (optional): Filter by status
- `department` (optional): Filter by department
- `start_date` (optional): Filter by start date (ISO format)
- `end_date` (optional): Filter by end date (ISO format)
- `owner` (optional): Set to "current_user" to filter by document owner

**Permission Rules:**
- **Admins:** Can see all workflows
- **Document Owners:** Can only see workflows for documents they own
  - When `owner=current_user`, filter by current user's email

**Request Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "document": 1,
    "status": "Draft",
    "action_by": "John Doe",
    "assigned_to": "Jane Smith",
    "comment": "Initial document creation",
    "created_at": "2024-01-15T10:00:00Z",
    "document_title": "Project Proposal Q1 2024",
    "document_owner": "john.doe@company.com",
    "department": "Finance"
  },
  {
    "id": 2,
    "document": 1,
    "status": "In Review",
    "action_by": "Jane Smith",
    "assigned_to": "Legal Team",
    "comment": "Document submitted for legal review",
    "created_at": "2024-01-16T14:30:00Z",
    "document_title": "Project Proposal Q1 2024",
    "document_owner": "john.doe@company.com",
    "department": "Finance"
  }
]
\`\`\`

## Database Schema

### Workflows Table

\`\`\`sql
CREATE TABLE workflows (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    action_by VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Denormalized fields for faster queries
    document_title VARCHAR(255),
    document_owner VARCHAR(255),
    department VARCHAR(100)
);

-- Indexes for performance
CREATE INDEX idx_workflows_document_id ON workflows(document_id);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_created_at ON workflows(created_at DESC);
CREATE INDEX idx_workflows_document_owner ON workflows(document_owner);
CREATE INDEX idx_workflows_department ON workflows(department);
\`\`\`

## Authentication

The frontend sends user information in the request headers:

\`\`\`javascript
headers: {
  'Authorization': 'Bearer {jwt_token}',
  'x-user-data': encodeURIComponent(JSON.stringify(user))
}
\`\`\`

Your backend should:
1. Validate the JWT token
2. Extract user information (id, email, name, role, department)
3. Use the role to enforce permissions
4. Use the email to filter workflows for non-admin users

## Status Values

The system uses these status values:
- **Draft**: Initial state, document is being created
- **In Review**: Document submitted for review
- **Approved**: Document has been approved
- **Rejected**: Document has been rejected

## User Roles

- **Admin**: Full access to all workflows, can change status and assignments
- **Document Owner**: Can only add comments to their own documents
- **Other Users**: No workflow permissions (read-only if they have document access)

## Integration Steps

1. **Create the workflows table** in your database using the schema above
2. **Implement the three API endpoints** with proper authentication and authorization
3. **Test with the frontend** - the UI is already connected and ready to use
4. **Update the API base URL** if needed (currently uses `/api/workflows`)

## Testing

The frontend includes mock data in `app/api/workflows/route.ts` for testing. Once your backend is ready:

1. Remove or comment out the mock API route
2. Update the fetch URLs to point to your backend
3. Ensure CORS is properly configured on your backend
4. Test all three user scenarios: Admin, Document Owner, and Other Users

## Error Handling

The frontend handles these error scenarios:
- 401 Unauthorized: User not authenticated
- 403 Forbidden: User doesn't have permission
- 404 Not Found: Document or workflow not found
- 500 Internal Server Error: Server error

Make sure your backend returns appropriate HTTP status codes and error messages in this format:

\`\`\`json
{
  "error": "Insufficient permissions"
}
\`\`\`

## Support

If you need help integrating the workflow system with your backend, please refer to the mock implementation in `app/api/workflows/route.ts` for reference.
