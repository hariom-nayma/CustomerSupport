import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './app/services/jwt.interceptor';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
   provideHttpClient(
      withInterceptors([jwtInterceptor])
    )
  ]
});

