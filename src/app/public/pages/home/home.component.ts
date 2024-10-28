import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CarService } from "../../../cars/services/car.service";
import { FavoriteService } from "../../../cars/services/favorite-service/favorite.service";
import { AuthService } from "../../../register/service/auth.service";
import { ReviewService } from "../../../mechanic/services/review.service";
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole: string = '';
  cars: any[] = [];
  pendingCars: any[] = [];
  certifiedCars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  loading: boolean = true;
  user: any;

  constructor(
    private router: Router,
    private carService: CarService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';
    this.loadAllCars();

    if (this.userRole === 'mechanic') {
      this.loadPendingAndCertifiedCars();
    }

    this.loadUserData();
  }

  loadUserData(): void {
    const userId = +localStorage.getItem('id')!;
    this.authService.getUserInfo(userId).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  loadAllCars() {
    this.loading = true;
    this.carService.getCars().subscribe(
      (data: any[]) => {
        this.cars = this.processCars(data);
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los autos:', error);
        this.loading = false;
      }
    );
  }

  loadPendingAndCertifiedCars() {
    this.loading = true;
    forkJoin({
      pendingCars: this.carService.getPendingCars(),
      certifiedCars: this.carService.getReviewedCars(),
    }).subscribe(
      (results) => {
        this.pendingCars = this.processCars(results.pendingCars);
        this.certifiedCars = this.processCars(results.certifiedCars);
        this.loadReviewsForCertifiedCars(this.certifiedCars);
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar coches pendientes/certificados:', error);
        this.loading = false;
      }
    );
  }

  processCars(cars: any[]): any[] {
    return cars.map(car => {
      car.image = car.image || this.defaultImage;
      car.images = car.images && car.images.length > 0 ? car.images : [this.defaultImage];
      return car;
    });
  }

  loadReviewsForCertifiedCars(certifiedCars: any[]): void {
    certifiedCars.forEach(car => {
      this.reviewService.getReviewsByCarId(car.id).subscribe(
        (reviews) => {
          if (reviews && reviews.length > 0) {
            const reviewUserRequests = reviews.map((review: any) => {
              return this.authService.getUserInfo(review.reviewedBy).pipe(
                map(userInfo => ({
                  ...review,
                  reviewerInfo: userInfo
                }))
              );
            });

            forkJoin(reviewUserRequests).subscribe(
              (reviewsWithUserInfo) => {
                car.reviews = reviewsWithUserInfo;
              },
              (error) => {
                console.error('Error al obtener información del revisor:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error al cargar las reseñas:', error);
        }
      );
    });
  }

  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }

  navigateToCarListingForm() {
    this.router.navigate(['/car-listing-form']);
  }

  startInspection() {
    this.router.navigate(['/mechanic-revision']);
  }

  addToFavorites(carId: number): void {
    this.favoriteService.addFavorite(carId).subscribe(
      response => {
        console.log('Coche añadido a favoritos:', response);
      },
      error => {
        console.error('Error al añadir coche a favoritos:', error);
      }
    );
  }

  trackByCarId(index: number, car: any): number {
    return car.id;
  }
}
