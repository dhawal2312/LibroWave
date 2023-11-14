import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { preventDashboardAccessGuard, preventLandingAccessGuard } from './guard/auth.guard';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { IssuedBooksComponent } from './issued-books/issued-books.component';
import { ReturnedBooksComponent } from './returned-books/returned-books.component';

const routes: Routes = [
  {path:'',redirectTo:'/landing',pathMatch:'full'},
  {path:'landing',component:LandingComponent, canActivate:[preventLandingAccessGuard]},
  {path:'dashboard',component:DashboardComponent, canActivate:[preventDashboardAccessGuard]},
  {path:'book-detail/:bookId',component:BookDetailComponent,canActivate:[preventDashboardAccessGuard]},
  {path:'issued-books',component:IssuedBooksComponent,canActivate:[preventDashboardAccessGuard]},
  {path:'returned-books',component:ReturnedBooksComponent,canActivate:[preventDashboardAccessGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
