/**
 * Shared error-handling utilities for LangGraph agent nodes.
 *
 * Every node should:
 *   1. Call `isAgentFailed(state)` at the top to skip if a previous node failed
 *   2. Wrap its logic in try/catch and return `nodeError(error)` on failure
 */

/**
 * Returns true when a preceding node has already marked the run as failed.
 * Nodes should return `{}` (no state update) immediately when this is true.
 */
export function isAgentFailed(state: { operationStatus: string }): boolean {
    return state.operationStatus === 'failed';
}

/**
 * Builds a consistent "failed" state update from any caught error.
 * The returned object is spread into the LangGraph state, setting
 * `operationStatus` to `'failed'` and `error` to a human-readable message.
 */
export function nodeError(error: unknown): { operationStatus: 'failed'; error: string } {
    return {
        operationStatus: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
    };
}
