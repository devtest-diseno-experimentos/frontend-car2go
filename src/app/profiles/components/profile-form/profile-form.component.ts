import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, switchMap, of } from "rxjs";
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "../../../register/services/authentication.service";

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent {
  isProfileCreated = false;
  photoPreview: string | ArrayBuffer | null = null;
  userRole = localStorage.getItem('userRole');

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

  constructor(private http: HttpClient, private authService: AuthenticationService, private router: Router) { }

  addProfile(profileRequest: any): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          })
        };

        return this.http.post<any>(`${this.baseURL}/profiles`, profileRequest, httpOptions);
      }),
      catchError(error => {
        console.error('Error al crear el perfil:', error);
        return of(null);
      })
    );
  }

  onSubmit() {
    const { paymentMethods, ...profileData } = this.profile;

    this.addProfile(profileData).subscribe(
      createdProfile => {
        console.log('Perfil creado o actualizado con éxito:', createdProfile);
        this.isProfileCreated = true;

        if (this.profile.paymentMethods.length > 0) {
          this.addPaymentMethods();
        }

        this.router.navigate(['/home']);
      },
      error => {
        console.error('Ocurrió un error al crear o actualizar el perfil:', error);
        this.router.navigate(['/error']);
      }
    );
  }


  addPaymentMethods() {
    this.authService.getToken().subscribe(token => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        })
      };

      this.profile.paymentMethods.forEach(method => {
        this.http.put<any>(`${this.baseURL}/profiles/me/payment-methods/add`, method, httpOptions).subscribe(
          response => {
            console.log('Método de pago añadido:', response);
          },
          error => {
            console.error('Error al añadir método de pago:', error);
          }
        );
      });
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
        this.profile.image = this.photoPreview as string;
      };
      reader.readAsDataURL(file);
    }
  }

  closeForm(): void {
    this.router.navigate(['/home']);
  }

  addPaymentMethod() {
    this.profile.paymentMethods.push({ type: '', details: '' });
  }

  removePaymentMethod(index: number) {
    this.profile.paymentMethods.splice(index, 1);
  }
}
