import { ReactNode } from 'react';

import { BottleMood, BottleType } from '../../lib/hydration-store';

export interface MascotDefinition {
    type: BottleType;
    name: string;
    path: string;
    colors?: [string, string]; // [start, end]
    hasCap?: boolean;
    show: boolean;
    renderFace: (mood: BottleMood) => ReactNode;
    dialogues: Record<BottleMood, string[]>;
}
