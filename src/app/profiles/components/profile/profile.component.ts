  import { Component, OnInit } from '@angular/core';
  import { HttpClient, HttpHeaders } from "@angular/common/http";
  import { catchError, of, forkJoin, tap, switchMap } from "rxjs";
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { environment } from "../../../../environments/environment";
  import { CarService } from "../../../cars/services/car/car.service";
  import { Router } from "@angular/router";

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
    recentFavorites: any[] = [];
    tempUserData: any = {};
    recentReviews: any[] = []; // Nueva variable para almacenar las reviews recientes
    subscriptionData: any = null; // Nueva variable para almacenar los datos de suscripción

    tempPaymentMethods: PaymentMethod[] = [];
    editMode: boolean = false;
    imagePreview: string | ArrayBuffer | null = null;

    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private router: Router,
      private carService: CarService // Inyecta CarService aquí

    ) {}

    ngOnInit() {
      this.loadProfileData();
    }

    navigateToCarDetails(vehicleId: number) {
      this.router.navigate(['/car-details', vehicleId]);
    }

    loadProfileData() {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const userProfile$ = this.http.get<any>(`${environment.serverBasePath}/users/${userId}`, { headers }).pipe(
        tap(userProfile => {
          this.userData = userProfile;
          this.currentRole = this.getRoleFromUser(userProfile);
        }),
        catchError(error => {
          return of(null);
        })
      );

      const profileData$ = this.http.get<any>(`${environment.serverBasePath}/profiles/me`, { headers }).pipe(
        tap(profileData => {
          this.userData = { ...profileData, paymentMethods: this.currentRole === 'ROLE_SELLER' ? profileData.paymentMethods || [] : [] };
          this.imagePreview = profileData.image;
        }),
        catchError(error => {
          return of(null);
        })
      );

      const subscriptionData$ =
        this.http.get<any>(`${environment.serverBasePath}/subscription/me`, { headers }).pipe(
          tap(subscription => {
            this.subscriptionData = subscription;
          }),
          catchError(error => {
            return of(null);
          })
        )


      userProfile$.pipe(
        switchMap(() => profileData$),
        switchMap(() => subscriptionData$),
        switchMap(() => {
          if (this.currentRole === 'ROLE_MECHANIC') {
            return this.http.get<any[]>(`${environment.serverBasePath}/reviews/me`, { headers }).pipe(
              switchMap(reviews => {
                this.recentReviews = reviews.slice(-3).reverse().map(review => ({
                  ...review,
                  vehicleImage: ''
                }));

                const vehicleImageRequests = this.recentReviews.map((review, index) =>
                  this.carService.getCarById(review.vehicle.id).pipe(
                    tap(vehicleData => {
                      if (typeof vehicleData.image === 'string') {
                        this.recentReviews[index].vehicleImage = vehicleData.image.split(',')[0] || '';
                      } else if (Array.isArray(vehicleData.image)) {
                        this.recentReviews[index].vehicleImage = vehicleData.image[0] || '';
                      }
                    }),
                    catchError(error => {
                      return of(null);
                    })
                  )
                );

                return forkJoin(vehicleImageRequests);
              }),
              catchError(error => {
                return of([]);
              })
            );
          } else if (this.currentRole === 'ROLE_BUYER') {
            return this.http.get<any[]>(`${environment.serverBasePath}/favorites/my-favorites`, { headers }).pipe(
              tap(favorites => {
                if (favorites && favorites.length > 0) {
                  this.recentFavorites = favorites.slice(-3).reverse();
                }
              }),
              catchError(error => {
                this.snackBar.open('Error fetching favorites', 'Close', { duration: 3000 });
                return of([]);
              })
            );
          } else {
            return of([]);
          }
        })
      ).subscribe();
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

    handleAddPaymentClick() {
      const activePaymentMethods = this.userData.paymentMethods.filter((method: PaymentMethod) => !method.markedForDeletion).length;

      if (activePaymentMethods >= 3) {
        this.snackBar.open('Only 3 active payment methods are allowed', 'Close', { duration: 3000 });
      } else {
        this.addNewPaymentMethod();
      }
    }


    addNewPaymentMethod() {
      this.userData.paymentMethods.push({ id: 0, type: '', details: '', markedForDeletion: false });
    }



    markForDeletion(index: number) {
      this.userData.paymentMethods[index].markedForDeletion = true;
    }



    onSave() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.snackBar.open('Token not found', 'Close', { duration: 3000 });
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
          switchMap(() => {
            if (this.currentRole === 'ROLE_SELLER') {
              const deleteRequests = this.userData.paymentMethods
                .filter((method: PaymentMethod) => method.markedForDeletion && method.id)
                .map((method: PaymentMethod) =>
                  this.http.delete<any>(`${environment.serverBasePath}/profiles/me/payment-methods/delete/${method.id}`, { headers })
                    .pipe(
                      catchError(error => {
                        this.snackBar.open(`Error deleting payment method with id ${method.id}`, 'Close', { duration: 3000 });
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
                          this.snackBar.open(`Error updating payment method with id ${method.id}`, 'Close', { duration: 3000 });
                          return of(null);
                        })
                      );
                  } else {
                    return this.http.put<any>(`${environment.serverBasePath}/profiles/me/payment-methods/add`, method, { headers })
                      .pipe(
                        catchError(error => {
                          this.snackBar.open('Error adding payment method', 'Close', { duration: 3000 });
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

              return forkJoin([...deleteRequests, ...saveRequests]);
            } else {
              return of([]);
            }
          }),
          switchMap(() => this.http.get<any>(`${environment.serverBasePath}/profiles/me`, { headers })),
          tap(profileData => {
            this.userData = { ...profileData };
            this.imagePreview = profileData.image;
            this.snackBar.open("Profile saved successfully", 'Close', { duration: 3000 });
            this.editMode = false;
          }),
          catchError(error => {
            this.snackBar.open('Error saving profile', 'Close', { duration: 3000 });
            return of(null);
          })
        )
        .subscribe();
    }
  }
