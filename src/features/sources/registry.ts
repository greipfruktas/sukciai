import type { SourceLevel } from "@/features/publication/policy";

export interface SourceRegistryEntry {
  hostname: string;
  level: SourceLevel;
  publisher: string;
}

export const officialSourceRegistry: readonly SourceRegistryEntry[] = [
  { hostname: "stt.lt", level: "A", publisher: "Specialiųjų tyrimų tarnyba" },
  { hostname: "prokuraturos.lt", level: "A", publisher: "Lietuvos Respublikos prokuratūra" },
  { hostname: "teismai.lt", level: "A", publisher: "Lietuvos teismai" },
  { hostname: "vtek.lt", level: "A", publisher: "VTEK" },
  { hostname: "vpt.lrv.lt", level: "A", publisher: "Viešųjų pirkimų tarnyba" },
];
