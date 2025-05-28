import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraficosLindasPage } from './graficos-lindas.page';

const routes: Routes = [
  {
    path: '',
    component: GraficosLindasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraficosPageRoutingModule {}
