import { barrel } from './barrel';
import { classic } from './classic';
import { cloud } from './cloud';
import { crystal } from './crystal';
import { cup } from './cup';
import { droplet } from './droplet';
import { gallon } from './gallon';
import { lotus } from './lotus';
import { moon } from './moon';
import { pebble } from './pebble';
import { plant } from './plant';
import { slim } from './slim';
import { soda } from './soda';
import { sport } from './sport';
import { square } from './square';
import { turtle } from './turtle';
import { MascotDefinition } from './types';
import { whale } from './whale';
import { zen } from './zen';

export const MASCOTS: MascotDefinition[] = [
    classic,
    slim,
    sport,
    square,
    gallon,
    soda,
    cup,
    barrel,
    crystal,
    droplet,
    zen,
    cloud,
    lotus,
    pebble,
    turtle,
    whale,
    moon,
    plant,
];

export const getActiveMascots = () => MASCOTS.filter(m => m.show);

export const getMascotByType = (type: string) => 
    MASCOTS.find(m => m.type === type) || classic;
