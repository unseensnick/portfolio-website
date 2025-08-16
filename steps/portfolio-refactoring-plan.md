# Portfolio Collection Refactoring Plan

This folder contains step-by-step implementation plans for improving the Portfolio.ts collection structure.

## Overview of Changes

The current Portfolio.ts collection (1,178 lines) has significant duplication and organization issues. This refactoring will:

1. **Create NavigationLinks Collection** - Replace inline nav arrays with reusable collection
2. **Implement Media Field Factories** - Eliminate 200+ lines of duplicated media controls
3. **Fix Field Organization** - Reorder fields for better logical flow

## Expected Outcomes

- **40% code reduction** (1,178 → ~600-700 lines)
- **Better admin UX** - Logical field ordering, reusable nav links
- **Easier maintenance** - Single source of truth for media controls
- **Consistent patterns** - Follows existing Tags.ts relationship model

## Implementation Order

1. **Step 1**: Create NavigationLinks collection (LOW RISK)
2. **Step 2**: Create media field factory helpers (MEDIUM RISK)  
3. **Step 3**: Fix field organization and ordering (LOW RISK)

## Files That Will Be Modified

- `src/collections/Portfolio.ts` - Main refactoring target
- `src/collections/NavigationLinks.ts` - New collection (create)
- `src/lib/mediaFieldHelpers.ts` - New helper utilities (create)
- `src/payload-types.ts` - Auto-regenerated after changes

## Testing Requirements

After each step:
1. Run `npm run generate:types` to update TypeScript types
2. Test admin panel functionality
3. Verify live preview still works
4. Check that existing data still loads correctly

## Risk Assessment

- **Step 1**: Low risk - Simple collection addition
- **Step 2**: Medium risk - Structural changes to media fields
- **Step 3**: Low risk - Field reordering only

## Rollback Plan

Each step creates git commits, allowing easy rollback if issues arise. The changes are designed to be backward compatible with existing data.

---

**Start with Step 1** when ready to begin implementation.