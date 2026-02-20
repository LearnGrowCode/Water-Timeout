import { barrel } from "./design/classic/barrel";
import { classic } from "./design/classic/classic";
import { slim } from "./design/classic/slim";
import { sport } from "./design/classic/sport";
import { square } from "./design/classic/square";

import { cloud } from "./design/nature/cloud";
import { droplet } from "./design/nature/droplet";
import { moon } from "./design/nature/moon";
import { pebble } from "./design/nature/pebble";
import { plant } from "./design/nature/plant";
import { turtle } from "./design/nature/turtle";
import { whale } from "./design/nature/whale";

import { cup } from "./design/vessels/cup";
import { flask } from "./design/vessels/flask";
import { gallon } from "./design/vessels/gallon";
import { jar } from "./design/vessels/jar";
import { soda } from "./design/vessels/soda";

import { bonsai } from "./design/zen/bonsai";
import { cairn } from "./design/zen/cairn";
import { crystal } from "./design/zen/crystal";
import { lotus } from "./design/zen/lotus";
import { zen } from "./design/zen/zen";
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
  jar,
  flask,
  cairn,
  bonsai,
];

export const getActiveMascots = () => MASCOTS.filter((m) => m.show);

export const getMascotByType = (type: string) =>
  MASCOTS.find((m) => m.type === type) || classic;
