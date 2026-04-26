export interface Bounty {
  id: string;
  merchantName: string;
  merchantType: string;
  maxDiscountPercentage: number;
  rules: string[];
  status: 'active' | 'inactive';
  targetDensity?: 'low' | 'medium' | 'high';
}

export interface LocalContext {
  batteryLevel: number;
  walkingSpeed: 'stationary' | 'browsing' | 'commuting' | 'running';
  weather: 'sunny' | 'raining' | 'cloudy' | 'snowing';
  temperatureC: number;
  timeOfDay: string;
  transactionDensity: 'high' | 'medium' | 'low';
  localEvents: string[];
  city: string;
}

export interface GeneratedOffer {
  headline: string;
  body: string;
  discountPercentage: number;
  uiTheme: 'warm' | 'cool' | 'urgent' | 'minimal';
  callToAction: string;
}
