import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken('WindowToken');4

export const windowFactory = () => window;
