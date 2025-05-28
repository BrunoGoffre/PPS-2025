import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraficosFeasPage } from './graficos-feas.page';

const routes: Routes = [
  {
    path: '',
    component: GraficosFeasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraficosFeasPageRoutingModule {}
