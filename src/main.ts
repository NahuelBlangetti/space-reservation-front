import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ToastModule } from 'primeng/toast';

bootstrapApplication(AppComponent, appConfig, importProvidersFrom(ToastModule)) 
  .catch((err) => console.error(err));
