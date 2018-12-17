import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PatronComponent } from './components/patron/patron.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'patron',      component: PatronComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
