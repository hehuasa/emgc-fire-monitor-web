import { atom } from 'recoil';

export interface IWeather {
  windDirection: string;
  windSpeed: number;
  temperature: number | string;
  rainfall: number | string;
}

export const lastWeatherModel = atom<IWeather | null>({
  key: 'lastWeather',
  default: null,
});

export const weatherEffectIsOpenModel = atom<boolean | null>({
  key: 'weatherEffectIsOpenModel_',
  default: null,
});
