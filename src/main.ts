import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => {
    // Bootstrap error handling
    throw err;
});
