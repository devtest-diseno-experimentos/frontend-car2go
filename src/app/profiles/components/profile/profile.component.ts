import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, of, forkJoin, tap } from "rxjs";
import { environment } from "../../../../environments/environment";

interface PaymentMethod {
  id: number;
  type: string;
  details: string;
  markedForDeletion?: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentRole: string = "";
  userData: any = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    dni: '',
    image: '',
    paymentMethods: [] as PaymentMethod[]
  };
  tempUserData: any = {};
  tempPaymentMethods: PaymentMethod[] = [];
  editMode: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    forkJoin({
      userProfile: this.http.get<any>(`${environment.serverBasePath}/users/${userId}`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return of(null);
        })
      ),
      profileData: this.http.get<any>(`${environment.serverBasePath}/profiles/me`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching profile data:', error);
          return of(null);
        })
      )
    }).subscribe(({ userProfile, profileData }) => {
      if (userProfile) {
        this.userData = userProfile;
        this.currentRole = this.getRoleFromUser(userProfile);
      }

      if (profileData) {
        this.userData = { ...profileData, paymentMethods: profileData.paymentMethods || [] };
        this.imagePreview = profileData.image;
      }
    });
  }

  getRoleFromUser(user: any): string {
    return user.roles?.includes('ROLE_SELLER') ? 'ROLE_SELLER' :
      user.roles?.includes('ROLE_MECHANIC') ? 'ROLE_MECHANIC' :
        user.roles?.includes('ROLE_BUYER') ? 'ROLE_BUYER' : 'User';
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'ROLE_SELLER': return 'Seller';
      case 'ROLE_MECHANIC': return 'Mechanic';
      case 'ROLE_BUYER': return 'Buyer';
      default: return 'User';
    }
  }

  toggleEditMode() {
    if (this.editMode) {
      this.userData = { ...this.tempUserData };
      this.userData.paymentMethods = [...this.tempPaymentMethods];
    } else {
      this.tempUserData = { ...this.userData };
      this.tempPaymentMethods = JSON.parse(JSON.stringify(this.userData.paymentMethods));
    }
    this.editMode = !this.editMode;
  }

  addNewPaymentMethod() {
    if (this.userData.paymentMethods.length < 3) {
      this.userData.paymentMethods.push({ id: 0, type: '', details: '', markedForDeletion: false });
    }
  }

  markForDeletion(index: number) {
    this.userData.paymentMethods[index].markedForDeletion = true;
  }

  onSave() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const profileUpdateData = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      image: this.userData.image,
      dni: this.userData.dni,
      address: this.userData.address,
      phone: this.userData.phone
    };

    this.http.put<any>(`${environment.serverBasePath}/profiles/me/edit`, profileUpdateData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating profile:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        const deleteRequests = this.userData.paymentMethods
          .filter((method: PaymentMethod) => method.markedForDeletion)
          .map((method: PaymentMethod) =>
            this.http.delete<any>(`${environment.serverBasePath}/profiles/me/payment-methods/delete/${method.id}`, { headers })
              .pipe(
                catchError(error => {
                  console.error(`Error deleting payment method with id ${method.id}:`, error);
                  return of(null);
                })
              )
          );

        const saveRequests = this.userData.paymentMethods
          .filter((method: PaymentMethod) => !method.markedForDeletion)
          .map((method: PaymentMethod) => {
            if (method.id) {
              return this.http.put<any>(`${environment.serverBasePath}/profiles/me/payment-methods/edit/${method.id}`, method, { headers })
                .pipe(
                  catchError(error => {
                    console.error(`Error updating payment method with id ${method.id}:`, error);
                    return of(null);
                  })
                );
            } else {
              return this.http.put<any>(`${environment.serverBasePath}/profiles/me/payment-methods/add`, method, { headers })
                .pipe(
                  catchError(error => {
                    console.error('Error adding payment method:', error);
                    return of(null);
                  }),
                  tap(response => {
                    if (response && response.id) {
                      method.id = response.id;
                    }
                  })
                );
            }
          });

        forkJoin([...deleteRequests, ...saveRequests]).subscribe(() => {
          this.http.get<any>(`${environment.serverBasePath}/profiles/me`, { headers })
            .pipe(
              tap(profileData => {
                this.userData.paymentMethods = profileData.paymentMethods.map((method: PaymentMethod) => ({ ...method }));
              })
            )
            .subscribe(() => {
              console.log("Profile and payment methods saved successfully");
              this.editMode = false;
            });
        });
      });
  }
}
