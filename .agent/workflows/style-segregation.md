---
description: follow style segregation architecture
---

To follow the project's style segregation architecture:

1. Identify the component or page being modified or created.
2. Create a companion style file:
   - For pages in `app/(tabs)`: `[filename].style.ts`
   - For components in `components/ui`: `[ComponentName].style.ts`
3. Move all `StyleSheet.create` logic into the `.style.ts` file.
4. Export the `styles` object from the style file.
5. In the main TSX file, import the `styles` object: `import { styles } from './[filename].style';`.
6. Ensure any dynamic theme-based styles are handled by passing the `theme` object to the component or using it for property overrides in the TSX file.
7. Remove any local `StyleSheet` definitions and unused imports (`StyleSheet`) from the TSX file.
