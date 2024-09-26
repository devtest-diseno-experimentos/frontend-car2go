import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";
import {FooterComponent} from "./public/components/footer/footer.component";
import {LoginComponent} from "./register/components/login/login.component";
import {RegisterComponent} from "./register/components/register/register.component";
import {ForgotPasswordComponent} from "./register/components/forgot-password/forgot-password.component";
import {CarDetailsComponent} from "./public/pages/car-details/car-details.component";
import { CarListingFormComponent } from './cars/car-listing-form/car-listing-form.component';
import {MechanicRevisionComponent}  from "./mechanic/mechanic-revision/mechanic-revision.component";
import {MechanicCheckComponent} from "./mechanic/mechanic-check/mechanic-check.component";
import {MechanicHomeComponent} from "./mechanic/components/mechanic-home/mechanic-home.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'home', component:HomeComponent },
  {path: 'footer', component:FooterComponent },
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'car-details/:id', component: CarDetailsComponent },
  {path:'mechanic-revision', component: MechanicRevisionComponent},
  {path:'mechanic-check', component: MechanicCheckComponent},
  {path: 'car-listing-form', component: CarListingFormComponent },
  {path: 'mechanic-home', component: MechanicHomeComponent },
  {path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
