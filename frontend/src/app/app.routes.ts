import { Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { TopbarComponent } from './topbar/topbar.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
        canActivate: [authGuard]
      },
      {
        path: 'players',
        loadComponent: () => import('./pages/players/players.page').then(m => m.PlayersPage),
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
        canActivate: [authGuard]
      },
      {
        path: 'detalle-player/:id',
        loadComponent: () => import('./pages/detalle-player/detalle-player.page').then( m => m.DetallePlayerPage),
        canActivate: [authGuard]
      },
      {
        path: 'detalle-partido/:id',
        loadComponent: () => import('./pages/detalle-partido/detalle-partido.page').then( m => m.DetallePartidoPage),
        canActivate: [authGuard]
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'more',
    loadComponent: () => import('./pages/more/more.page').then( m => m.MorePage),
    canActivate: [authGuard]
  },
  {
    path: 'create-player',
    loadComponent: () => import('./pages/create-player/create-player.page').then( m => m.CreatePlayerPage),
    canActivate: [authGuard]
  },
  {
    path: 'pro',
    loadComponent: () => import('./pages/pro/pro.page').then( m => m.ProPage),
    canActivate: [authGuard]
  },
  {
    path: 'info',
    loadComponent: () => import('./pages/info/info.page').then( m => m.InfoPage),
    canActivate: [authGuard]
  },
  {
    path: 'create-partido',
    loadComponent: () => import('./pages/create-partido/create-partido.page').then( m => m.CreatePartidoPage),
    canActivate: [authGuard]
  },
  {
    path: 'create-resultado',
    loadComponent: () => import('./pages/create-resultado/create-resultado.page').then( m => m.CreateResultadoPage),
    canActivate: [authGuard]
  },
  
];
