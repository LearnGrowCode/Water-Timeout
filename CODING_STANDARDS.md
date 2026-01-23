# Coding Standards - Water Timeout

To ensure maintainability and readability, please follow these project-specific coding standards.

## 1. Style Segregation
All styles must be separated from the logic components. 

- **Pages**: Styles for page components (in `app/(tabs)`) should be in a file named `[filename].style.ts` in the same directory.
  - Example: `settings.tsx` -> `settings.style.ts`
- **Reusable Components**: Styles for UI components (in `components/ui`) should be in a file named `[ComponentName].style.ts` in the same directory.
  - Example: `Dropdown.tsx` -> `Dropdown.style.ts`

### Implementation Detail
- Always export a `styles` constant created with `StyleSheet.create`.
- Import the `styles` into the component file.
- Use the `theme` object (from `Colors`) for dynamic colors by passing it to components or styles where necessary.

## 2. Component Reusability
- Extract common UI patterns (like setting rows, dropdowns, buttons) into `components/ui`.
- Components should be functional and accept `theme` as a prop if they need to handle dark/light mode dynamically.

## 3. Tech Stack
- **Framework**: Expo / Next.js (as per project)
- **Styling**: React Native StyleSheet (Vanilla CSS for web apps)
- **Icons**: Lucide-react-native
- **Animations**: React-native-reanimated
