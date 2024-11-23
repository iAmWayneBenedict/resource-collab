# Mutation Hooks Naming Convention
=====================================

## Hook Naming Pattern

Follow the pattern `use[Method][Name]Mutation` when creating mutation hooks. For example:

* `usePostLoginMutation` for POST requests
* `usePutUserMutation` for PUT requests

## Recommended Methods

When creating mutation hooks, utilize the following methods:

* `post` for creating or updating resources
* `put` for updating resources

## Why Consistency Matters
---------------------------

Consistent naming conventions enhance code readability and maintainability. By following these guidelines, you'll make it easier for yourself and others to understand and work with your codebase.