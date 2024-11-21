import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, forkJoin, switchMap, tap, catchError } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "../../../register/services/authentication.service";
import { SubscriptionService } from "../../../plans/service/subscription.service";

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent {
  isProfileCreated = false;
  photoPreview: string | ArrayBuffer | null = null;
  userRole = localStorage.getItem('userRole');
  isFormValid = false;

  private baseURL = environment.serverBasePath;

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    dni: '',
    address: '',
    phone: '',
    paymentMethods: [
      { type: '', details: '' }
    ]
  };
  banks = ['BBVA', 'BCP', 'Scotiabank', 'Interbank', 'Banco de la Nación'];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  removeImage() {
    this.photoPreview = null;
    const fileInput = document.getElementById('newImages') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    this.checkFormValidity();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('newImages') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  onSubmit() {
    const { paymentMethods, ...profileData } = this.profile;
    this.addProfile(profileData).subscribe(
      createdProfile => {
        this.snackBar.open('Profile created or updated successfully', 'Close', { duration: 3000 });
        this.isProfileCreated = true;

        if (paymentMethods.length > 0) {
          this.addPaymentMethods(paymentMethods).subscribe(() => {
            if (this.userRole === 'ROLE_SELLER') {
              this.checkAndRedirectBasedOnSubscription();
            } else {
              this.router.navigate(['/home']);
            }
          });
        } else {
          this.router.navigate(['/home']);
        }
      },
      error => {
        this.snackBar.open('Error creating or updating profile', 'Close', { duration: 3000 });
        this.router.navigate(['/error']);
      }
    );
  }

  addProfile(profileRequest: any): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };
        return this.http.post<any>(`${this.baseURL}/profiles`, profileRequest, httpOptions);
      }),
      catchError(error => {
        this.snackBar.open('Error creating profile', 'Close', { duration: 3000 });
        return of(null);
      })
    );
  }

  addPaymentMethods(paymentMethods: any[]): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        const addMethods$ = paymentMethods.map(method =>
          this.http.put<any>(`${this.baseURL}/profiles/me/payment-methods/add`, method, httpOptions).pipe(
            tap(response => {
              if (response && response.id) {
                method.id = response.id;
              }
            })
          )
        );

        return forkJoin(addMethods$);
      }),
      catchError(error => {
        this.snackBar.open('Error adding payment methods', 'Close', { duration: 3000 });
        return of(null);
      })
    );
  }

  checkFormValidity() {
    const isProfileValid = !!(
      this.profile.firstName &&
      this.profile.lastName &&
      this.profile.email &&
      this.profile.dni &&
      this.profile.address &&
      this.profile.phone &&
      this.photoPreview
    );

    // Verifica los métodos de pago si el usuario es vendedor
    const isPaymentMethodsValid = this.profile.paymentMethods.every(
      method =>
        method.type &&
        method.details &&
        /^[0-9]{12,16}$/.test(method.details)
    );

    this.isFormValid = isProfileValid && (this.userRole !== 'ROLE_SELLER' || isPaymentMethodsValid);
  }


  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
        this.profile.image = this.photoPreview as string;
        this.checkFormValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  addPaymentMethod() {
    if (this.profile.paymentMethods.length >= 3) {
      this.snackBar.open('You can only add up to 3 payment methods', 'Close', { duration: 3000 });
    } else {
      this.profile.paymentMethods.push({ type: '', details: '' });
      this.checkFormValidity();
    }
  }

  removePaymentMethod(index: number) {
    this.profile.paymentMethods.splice(index, 1);
    this.checkFormValidity();
  }

  private checkAndRedirectBasedOnSubscription() {
    this.subscriptionService.getMySubscription().subscribe(
      subscription => {
        if (subscription && subscription.status === 'PAID') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/plan']);
        }
      },
      error => {
        this.router.navigate(['/plan']);
      }
    );
  }
}
