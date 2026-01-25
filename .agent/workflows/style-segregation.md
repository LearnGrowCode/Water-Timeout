---
description: follow style segregation architecture
---

To follow the project's style segregation architecture:

8. Create a companion style file in the root `styles/` directory:
   - For pages (e.g., `app/(tabs)/index.tsx`): `styles/pages/index.style.ts`
   - For shared components (e.g., `components/ui/Dropdown.tsx`): `styles/ui/Dropdown.style.ts`
   - For local components (e.g., `components/WaterBottle.tsx`): `styles/components/WaterBottle.style.ts`
9. Move all `StyleSheet.create` logic into the `.style.ts` file.
10. Export the `styles` object from the style file.
11. In the main TSX file, import the `styles` object: `import { styles } from '@/styles/...';`.
12. Ensure any dynamic theme-based styles are handled by passing the `theme` object to the component or using it for property overrides in the TSX file.
13. Remove any local `StyleSheet` definitions and unused imports (`StyleSheet`) from the TSX file.
