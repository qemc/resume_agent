# Testing a Single Agent Invocation

This guide explains how to execute or test a single LangGraph agent invocation locally within this repository.

## Runner Entrypoint
The backend contains a dedicated entrypoint script for executing agents locally at [main.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/main.ts).

## Execution Instructions

1. Navigate to the backend application directory:
   ```bash
   cd apps/backend
   ```
2. Run the `agent` npm script:
   ```bash
   npm run agent
   ```
   *(This runs `tsx src/agentic/main.ts` which compiles and executes the file on the fly).*

## How to Test a Custom Flow or Agent
To test a different agent or modify invocation inputs, edit the `main()` function in [main.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/main.ts):

```typescript
import { resumeAgent } from './resume/resume';
import { closeDb } from '../db';

async function main() {
    try {
        // Call your agent's .invoke() with test state parameters
        const result = await resumeAgent.invoke({ 
            carrerPathId: 7, 
            userId: 2, 
            language: 'EN' 
        });
        console.log("Agent Output:", result);
    } finally {
        // Ensure database connection is closed after invocation completes
        await closeDb();
    }
}
```
