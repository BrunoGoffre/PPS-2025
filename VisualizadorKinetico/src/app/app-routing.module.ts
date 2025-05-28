import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'bonitas',
    loadChildren: () => import('./pages/bonitas/bonitas.module').then( m => m.BonitasPageModule)
  },
  {
    path: 'feas',
    loadChildren: () => import('./pages/feas/feas.module').then(m => m.FeasPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'listadolindas',
    loadChildren: () => import('./pages/listado-lindas/listado-lindas.module').then( m => m.ListadoLindasPageModule)
  },
  {
    path: 'listadofeas',
    loadChildren: () => import('./pages/listado-feas/listado-feas.module').then( m => m.ListadoPageModule)
  },
  {
    path: 'graficoslindas',
    loadChildren: () => import('./pages/graficos-lindas/graficos-lindas.module').then( m => m.GraficosLindasPageModule)
  },
  {
    path: 'graficosfeas',
    loadChildren: () => import('./pages/graficos-feas/graficos-feas.module').then( m => m.GraficosLindasPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
