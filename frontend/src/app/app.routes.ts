import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
  path: 'login',
  loadComponent: () =>
    import('./auth/login/login.component').then(m => m.LoginComponent)
},


  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  {
    path: 'ticketcreate',canActivate: [AuthGuard],
    loadComponent: () => import('./ticket/create/create.component').then(
      (m) => m.CreateComponent),
  },

  {
    path: 'ticketlist',canActivate: [AuthGuard],
    loadComponent: () => import('./ticket/list/list.component').then(
      (m) => m.ListComponent),
  },

   {
    path: 'userlist',canActivate: [AuthGuard],
    loadComponent: () => import('./auth/list/list.component').then(
      (m) => m.ListComponent),
  },

 {
    path: 'dashboard',canActivate: [AuthGuard],
    loadComponent: () => import('./dashboard/mac/mac.component').then(
      (m) => m.MacComponent),
},
{
  path: 'ticket/:id',
  loadComponent: () =>
    import('./ticket/details/details.component').then((m) => m.DetailsComponent),
  canActivate: [AuthGuard]
},
{
    path: 'home',
    loadComponent: () => import('./home/main/main.component').then(
      (m) => m.MainComponent),
},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }, 
];
