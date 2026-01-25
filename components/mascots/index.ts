import { barrel } from "./design/barrel";
import { classic } from "./design/classic";
import { cloud } from "./design/cloud";
import { crystal } from "./design/crystal";
import { cup } from "./design/cup";
import { droplet } from "./design/droplet";
import { gallon } from "./design/gallon";
import { lotus } from "./design/lotus";
import { moon } from "./design/moon";
import { pebble } from "./design/pebble";
import { plant } from "./design/plant";
import { slim } from "./design/slim";
import { soda } from "./design/soda";
import { sport } from "./design/sport";
import { square } from "./design/square";
import { turtle } from "./design/turtle";
import { whale } from "./design/whale";
import { zen } from "./design/zen";
import { MascotDefinition } from "./types";

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

export const getActiveMascots = () => MASCOTS.filter((m) => m.show);

export const getMascotByType = (type: string) =>
  MASCOTS.find((m) => m.type === type) || classic;
