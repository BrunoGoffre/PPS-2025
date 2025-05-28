import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BonitasPage } from './bonitas.page';

const routes: Routes = [
  {
    path: '',
    component: BonitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BonitasPageRoutingModule {}
