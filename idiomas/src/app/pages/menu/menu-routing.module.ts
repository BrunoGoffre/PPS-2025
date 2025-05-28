import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'animales',
        loadChildren: () => import('../../pages/animales/animales.module').then(m => m.AnimalesPageModule)
      },
      {
        path: 'colores',
        loadChildren: () => import('../../pages/colores/colores.module').then(m => m.ColoresPageModule)
      },
      {
        path: 'numeros',
        loadChildren: () => import('../../pages/numeros/numeros.module').then(m => m.NumerosPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
