# Agent Error Handling — Implementation Guide

> **Date:** 2026-07-28  
> **Applies to:** All LangGraph agents in `apps/backend/src/agentic/`  
> **Required reading before:** Creating or modifying any agent node

---

## 1. Overview

This project uses a **3-layer error handling** strategy for LangGraph agents. Every agent failure flows through these layers in order:

```
Layer 1: Agent Node         → catches error, writes to state
Layer 2: Route Handler      → reads state, throws HTTP error  
Layer 3: Frontend           → catches HTTP error, shows to user
```

**The core principle:** Agents never throw exceptions. Instead, they record failures in state, and the calling route handler decides what to do.

---

## 2. Layer 1 — Inside Agent Nodes

### 2.1 Shared Utility File

All error handling utilities live in a single file:

**File:** [nodeGuard.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/nodeGuard.ts)

This file exports two functions:

| Function | Purpose | Returns |
|----------|---------|---------|
| `isAgentFailed(state)` | Checks if a previous node already failed | `true` / `false` |
| `nodeError(error)` | Creates a standard failure state update | `{ operationStatus: 'failed', error: string }` |

### 2.2 Required State Fields

Every agent state (`state.ts`) **must** include these two fields:

```typescript
operationStatus: Annotation<AgentStatus>({
    reducer: (x, y) => y ?? x,
    default: () => 'init'
}),
error: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
    default: () => undefined
}),
```

The `AgentStatus` type is defined in [agent.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/types/agent.ts) as:

```typescript
export type AgentStatus = 'success' | 'failed' | 'init';
```

**All three existing agents have these fields:**
- [enhance/state.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/enhance/state.ts) — has both fields
- [topics/state.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/topics/state.ts) — has both fields
- [resume/state.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/resume/state.ts) — has both fields

### 2.3 The Node Pattern (MUST follow for every node)

Every agent node function **must** follow this exact structure:

```typescript
import { isAgentFailed, nodeError } from "../nodeGuard";

export async function myNode(state: typeof State.State) {
    // STEP 1: Guard — skip if a previous node already failed
    if (isAgentFailed(state)) return {};

    // STEP 2: Wrap all logic in try/catch
    try {
        // ... your node logic here (LLM calls, DB queries, etc.)

        return {
            // ... state updates on success
        };
    } catch (error) {
        // STEP 3: Return standardized failure state
        return nodeError(error);
    }
}
```

**What this pattern achieves:**

1. **Guard at the top** — If node A fails, nodes B, C, D immediately return `{}` (no state changes). This prevents cascading errors. No additional LLM calls or DB queries are wasted.

2. **try/catch around all logic** — Any error (LLM timeout, DB failure, validation error) is caught and recorded in state instead of crashing the graph.

3. **nodeError(error)** — Extracts the error message consistently. If the caught value is an `Error` instance, uses `.message`. Otherwise returns `'Unknown error'`.

### 2.4 Real Example — detectLang node

Here is a real example from the resume agent:

```typescript
export async function detectLang(state: typeof State.State) {
    if (isAgentFailed(state)) return {};          // ← Guard

    try {
        const detectLangChain = detectLangPrompt.pipe(detectLangModel)
        const rawJobText = state.rawJobOfferText

        const result = await detectLangChain.invoke({  // ← LLM call
            raw_job_text: rawJobText
        })

        return {
            language: result                       // ← Success: update state
        }
    } catch (error) {
        return nodeError(error);                   // ← Failure: record in state
    }
}
```

**Source:** [resume/nodes.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/resume/nodes.ts)

### 2.5 Validation Errors Inside Nodes

If a node needs to fail on a business logic condition (not an exception), create an `Error` and pass it to `nodeError`:

```typescript
if (result.topics.length !== state.careerPathTopics.length) {
    return nodeError(
        new Error(`Unify node error: expected ${state.careerPathTopics.length} topics, got ${result.topics.length}`)
    );
}
```

**Do NOT throw** inside a node. Always **return** `nodeError(...)`. Throwing would crash the LangGraph execution and bypass state tracking.

### 2.6 What Happens When a Node Fails

```
Node 1 (detectLang): succeeds → state.operationStatus stays 'init'
Node 2 (fillNode):   LLM fails → returns { operationStatus: 'failed', error: 'Rate limit' }
Node 3 (selectSkills): sees operationStatus === 'failed' → returns {} (skipped)
Node 4 (selectExp):    sees operationStatus === 'failed' → returns {} (skipped)

Graph reaches END.
Final state: { operationStatus: 'failed', error: 'Rate limit', ... }
```

All nodes after the failure are **skipped**, not crashed. The graph completes normally.

---

## 3. Layer 2 — Route Handlers (Invoke-Site Checks)

After calling `agent.invoke(...)` in a route handler, **always** check the returned state:

```typescript
const result = await topicsAgent.invoke({
    expId: experience,
    careerPathId: careerPath,
    resumeLang: lang
});

// Check if the agent reported failure
if (result.operationStatus === 'failed') {
    throw new AppError(ERRORS.AI_ERROR, result.error ?? 'Agent failed with no details');
}
```

**Source:** [routes/topics.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/routes/topics.ts)

### 3.1 Why This Matters

- The agent itself **never throws**. It always completes and returns a state object.
- The route handler is responsible for **converting** the `'failed'` status into an HTTP error.
- The `AppError` is caught by Fastify's global error middleware in [server.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/server.ts), which sends a proper HTTP response:

```json
{
    "success": false,
    "code": "AI_001",
    "message": "An AI agent error: Rate limit exceeded"
}
```

### 3.2 AppError and ERRORS

The error codes are defined in [utils/errors.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/utils/errors.ts).

For agent failures, use `ERRORS.AI_ERROR`:

```typescript
import { AppError, ERRORS } from "../../utils/errors";

throw new AppError(ERRORS.AI_ERROR, result.error);
```

The `AppError` class accepts an optional `details` string as the second argument, which gets appended to the base error message.

---

## 4. Layer 3 — Frontend Error Display

### 4.1 How Errors Reach the Frontend

```
Backend throws AppError(ERRORS.AI_ERROR)
  → Fastify error middleware returns HTTP 466 with JSON body
  → Axios in frontend receives non-2xx → throws AxiosError
  → Component .catch() block handles it
```

### 4.2 TopicsGenerationContext Error Handling

The [TopicsGenerationContext.tsx](file:///Users/qemc/Documents/Code/resume_agent-1/apps/frontend/src/contexts/TopicsGenerationContext.tsx) manages all AI generation calls. It has:

- **`lastError: string | null`** — stores the most recent error message
- **`clearError()`** — resets error to null (called on dismiss or new generation start)
- **`extractErrorMessage(error)`** — helper that extracts human-readable messages from Axios errors

```typescript
function extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
        return error.response.data.message;  // ← Uses the AppError message from backend
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred during generation.';
}
```

**In the `.catch()` blocks:**

```typescript
.catch(error => {
    console.error('Failed to generate all topics:', error);
    setLastError(extractErrorMessage(error));  // ← Shows to user
    notifySettled();
})
```

**Error auto-clears** when the user starts a new generation (`setLastError(null)` at the start of each generation function).

### 4.3 ErrorBanner Component

The [ErrorBanner.tsx](file:///Users/qemc/Documents/Code/resume_agent-1/apps/frontend/src/components/ErrorBanner.tsx) renders a dismissable red banner:

```tsx
<ErrorBanner message={lastError} onDismiss={clearError} />
```

It renders nothing when `message` is `null`. When there's an error, it shows a red banner with the error text and a dismiss (×) button.

**Used in:** [ExperienceTopicsSection.tsx](file:///Users/qemc/Documents/Code/resume_agent-1/apps/frontend/src/components/ExperienceTopicsSection.tsx) — positioned between the header buttons and the topics list.

---

## 5. End-to-End Error Flow (Complete Example)

Here is what happens when an LLM call fails:

```
1. LLM call in detectLang node throws "Rate limit exceeded"
       ↓
2. catch block returns { operationStatus: 'failed', error: 'Rate limit exceeded' }
       ↓
3. fillNode sees isAgentFailed(state) === true → returns {} (skipped)
       ↓
4. selectSkills sees isAgentFailed(state) === true → returns {} (skipped)
       ↓
5. Graph reaches END with state.operationStatus === 'failed'
       ↓
6. Route handler checks: result.operationStatus === 'failed'
       ↓
7. Route throws: new AppError(ERRORS.AI_ERROR, 'Rate limit exceeded')
       ↓
8. Fastify sends: HTTP 466 { success: false, code: 'AI_001', message: 'An AI agent error: Rate limit exceeded' }
       ↓
9. Axios throws AxiosError in frontend
       ↓
10. TopicsGenerationContext .catch() calls setLastError('An AI agent error: Rate limit exceeded')
       ↓
11. ErrorBanner renders red banner with the error message
       ↓
12. User sees: "An AI agent error: Rate limit exceeded" with a dismiss button
```

---

## 6. Checklist — Adding a New Agent

When creating a new agent, follow these steps for error handling:

- [ ] Add `operationStatus` and `error` fields to `state.ts` (copy from any existing agent)
- [ ] Import `isAgentFailed` and `nodeError` from `../nodeGuard` in `nodes.ts`
- [ ] Add `if (isAgentFailed(state)) return {};` as the **first line** of every node function
- [ ] Wrap **all** async logic in try/catch
- [ ] Return `nodeError(error)` in every catch block
- [ ] In the route handler that calls `agent.invoke()`, check `result.operationStatus === 'failed'`
- [ ] Throw `new AppError(ERRORS.AI_ERROR, result.error)` if failed
- [ ] On the frontend, handle the error in the appropriate context/component using `extractErrorMessage()`

---

## 7. File Reference

| File | Purpose |
|------|---------|
| [nodeGuard.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/agentic/nodeGuard.ts) | `isAgentFailed()` and `nodeError()` utilities |
| [utils/errors.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/utils/errors.ts) | `AppError` class and `ERRORS` constant (includes `AI_ERROR`) |
| [server.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/server.ts) | Fastify global error handler — catches `AppError` and sends HTTP response |
| [TopicsGenerationContext.tsx](file:///Users/qemc/Documents/Code/resume_agent-1/apps/frontend/src/contexts/TopicsGenerationContext.tsx) | Frontend generation state — holds `lastError`, `clearError`, `extractErrorMessage` |
| [ErrorBanner.tsx](file:///Users/qemc/Documents/Code/resume_agent-1/apps/frontend/src/components/ErrorBanner.tsx) | Dismissable red error banner component |
| [agent.ts](file:///Users/qemc/Documents/Code/resume_agent-1/apps/backend/src/types/agent.ts) | `AgentStatus` type definition |

---

## 8. Common Mistakes to Avoid

| Mistake | Why it's wrong | Correct approach |
|---------|---------------|-----------------|
| Throwing `AppError` inside a node | Crashes the LangGraph graph — state never records the failure | Return `nodeError(new Error('...'))` |
| Forgetting the guard at the top | Later nodes run against broken/incomplete state, causing secondary crashes | Always add `if (isAgentFailed(state)) return {};` as the first line |
| Using `console.log(error)` in catch without returning | Error is silently swallowed, subsequent code uses undefined values | Always `return nodeError(error)` |
| Not checking `operationStatus` after `.invoke()` | Agent failure is invisible — route returns empty/broken data to frontend | Always check `result.operationStatus === 'failed'` |
| Frontend `.catch()` only using `console.error` | User sees spinner disappear with no feedback | Call `setLastError(extractErrorMessage(error))` |
