import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoFeasPage } from './listado-feas.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoFeasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoFeasPageRoutingModule {}
