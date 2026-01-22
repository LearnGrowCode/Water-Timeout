# Developer Guide: Adding a New Mascot

Follow these steps to add a new mascot character to the application.

## 1. Define the Mascot Type
Open `lib/hydration-store.tsx` and add your new mascot's ID to the `BottleType` union.

```typescript
export type BottleType = 'classic' | ... | 'your_new_id';
```

## 2. Create the Mascot File
Create a new file in `components/mascots/your_new_id.tsx`.
7.  **Add dialogues**: Add a `dialogues` object with arrays of messages for each `BottleMood`.
8.  **Render Face with mood**: Ensure your `renderFace` function uses the `mood` parameter to return different facial expressions.

### Example

```tsx
import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const myMascot: MascotDefinition = {
    type: 'myMascot',
    name: 'My Mascot',
    path: "...",
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["I'm thirsty!"],
        mild: ["Water?"],
        okay: ["Better!"],
        happy: ["Perfect!"]
    }
};
```

## Face System

We have a central `faces.tsx` file that exports reusable face components which accept a `mood` prop:

- `StandardFace`: Traditional round eyes and mouth that change with mood.
- `ZenFace`: Calming, closed eyes that open joyfully when happy.

You can create custom local face components within your mascot file for unique characters (see `WhaleFace` in `whale.tsx`).

```tsx
import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const your_new_id: MascotDefinition = {
    type: 'your_new_id',
    name: 'Friendly Name',
    path: "M ... Z", // SVG Path data
    hasCap: true, // Optional: Renders a cap on top
    colors: ['#START', '#END'], // Optional: Custom gradient colors
    show: true, // Set to false to hide from settings grid
    renderFace: (mood) => <StandardFace mood={mood} />
};
```

## 3. Register the Mascot
Open `components/mascots/index.ts`.
- Import your new mascot definition.
- Add it to the `MASCOTS` array.

```typescript
import { your_new_id } from './your_new_id';

export const MASCOTS: MascotDefinition[] = [
    // ...
    your_new_id,
];
```

## 4. Design Guidelines
- **Path**: Keep paths within a `0 0 150 200` viewBox for consistency.
- **Faces**: You can use `StandardFace`, `ZenFace`, or create a custom `renderFace` function for unique characters.
- **Colors**: If no `colors` are provided, the mascot will use mood-dependent colors from the theme.
