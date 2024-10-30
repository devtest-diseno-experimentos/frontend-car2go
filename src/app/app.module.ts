import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgOptimizedImage} from '@angular/common';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { SlickCarouselModule } from 'ngx-slick-carousel';


// Feature Components Imports
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import { HomeComponent } from './public/pages/home/home.component';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { FooterComponent } from './public/components/footer/footer.component';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { LoginComponent } from './register/components/login/login.component';
import { RegisterComponent } from './register/components/register/register.component';
import { ForgotPasswordComponent } from './register/components/forgot-password/forgot-password.component';
import { CarDetailsComponent } from './public/pages/car-details/car-details.component';
import { CarListingFormComponent } from './cars/components/car-listing-form/car-listing-form.component';
import { MechanicRevisionComponent } from './mechanic/components/mechanic-revision/mechanic-revision.component';
import { MechanicCheckComponent } from './mechanic/components/mechanic-check/mechanic-check.component';
import {PlanComponent} from "./plans/components/plan/plan.component";
import {PaymentFormComponent} from "./plans/components/payment-form/payment-form.component";
import { MyCarsComponent } from './cars/components/my-cars/my-cars.component';
import { CarListingComponent } from './cars/components/car-listing/car-listing.component';
import { FavoritesComponent } from './cars/components/favorites/favorites.component';
import { ProfileComponent } from './profiles/components/profile/profile.component';
import { PayComponent } from './buyer/components/pay/pay.component';
import { SendDataComponent } from './buyer/components/send-data/send-data.component';
import { TechnicalReviewComponent } from './buyer/components/technical-review/technical-review.component';
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { ProfileFormComponent } from './profiles/components/profile-form/profile-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    FooterComponent,
    ToolbarComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    CarDetailsComponent,
    CarListingFormComponent,
    MechanicRevisionComponent,
    MechanicCheckComponent,
    PlanComponent,
    PaymentFormComponent,
    MyCarsComponent,
    CarListingComponent,
    ProfileComponent,
    FavoritesComponent,
    PayComponent,
    SendDataComponent,
    TechnicalReviewComponent,
    ProfileFormComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatExpansionModule,
    NgOptimizedImage,
    CdkDropList,
    CdkDrag,
    MatProgressSpinner,
    SlickCarouselModule,
    MatSnackBarModule
  ],
  providers: [
    provideAnimationsAsync(),
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
