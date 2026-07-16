import type { PostBody } from '../blocks';
import { body as garageDoorCostTexas } from './garage-door-cost-texas';
import { body as brokenGarageDoorSpringSigns } from './broken-garage-door-spring-signs';
import { body as garageDoorWontOpen } from './garage-door-wont-open';
import { body as insulatedVsNonInsulated } from './insulated-vs-non-insulated-garage-doors';
import { body as bestGarageDoorTexasHeat } from './best-garage-door-texas-heat';
import { body as commercialOverheadDoorTypes } from './commercial-overhead-door-types';
import { body as garageDoorOpenerGuide } from './garage-door-opener-guide';
import { body as garageDoorMaintenanceChecklist } from './garage-door-maintenance-checklist';
import { body as barndominiumGarageDoors } from './barndominium-garage-doors';

/** slug -> article body. Every POSTS slug must have an entry here. */
export const BODIES: Record<string, PostBody> = {
  'garage-door-cost-texas': garageDoorCostTexas,
  'broken-garage-door-spring-signs': brokenGarageDoorSpringSigns,
  'garage-door-wont-open': garageDoorWontOpen,
  'insulated-vs-non-insulated-garage-doors': insulatedVsNonInsulated,
  'best-garage-door-texas-heat': bestGarageDoorTexasHeat,
  'commercial-overhead-door-types': commercialOverheadDoorTypes,
  'garage-door-opener-guide': garageDoorOpenerGuide,
  'garage-door-maintenance-checklist': garageDoorMaintenanceChecklist,
  'barndominium-garage-doors': barndominiumGarageDoors
};
