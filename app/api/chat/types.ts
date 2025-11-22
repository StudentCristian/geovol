export type Region = 'la-guajira' | 'magdalena' | 'atlantico';  
export type EnergyType = 'solar' | 'eolico' | 'hibrido';  
  
export interface RegionAnalysis {  
  region: Region;  
  solarPotential: number; // 0-100  
  windPotential: number; // 0-100  
  recommendation: EnergyType;  
  confidence: number;  
  sources: string[];  
}