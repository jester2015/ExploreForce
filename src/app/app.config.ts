import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideMarkdown } from 'ngx-markdown';
import { provideCodeEditor } from '@ngstack/code-editor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch()),
    provideMarkdown(),
    providePrimeNG({
    theme: {
      preset: Aura
    }
  }), provideAnimationsAsync(),
  provideCodeEditor()]
};
