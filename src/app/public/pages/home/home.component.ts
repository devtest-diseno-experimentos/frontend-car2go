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

    if (this.userRole === 'ROLE_MECHANIC') {
      this.loadPendingAndCertifiedCars();
    }

    this.loadUserData();
  }

  loadUserData(): void {
    const userId = +localStorage.getItem('userId')!;
    this.authService.getUserInfo(userId).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  reviews: any[] = []; // Nueva variable para almacenar reviews

  loadAllCars() {
    this.loading = true;
    this.carService.getCars().subscribe(
      (data: any[]) => {
        this.cars = this.processCars(data);
        this.loadAllReviews(); // Cargar reviews después de cargar los autos
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching cars:', error);
        this.loading = false;
      }
    );
  }

  loadAllReviews(): void {
    this.reviewService.getAllReviews().subscribe(
      (reviewsData) => {
        this.reviews = reviewsData;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }


  loadPendingAndCertifiedCars() {
    this.loading = true;
    this.carService.getCars().subscribe(
      (cars: any[]) => {
        this.pendingCars = this.processCars(cars.filter(car => car.status === 'PENDING'));
        this.certifiedCars = this.processCars(cars.filter(car => car.status === 'REVIEWED'));
        this.loadReviewsForCertifiedCars(this.certifiedCars);
        this.loading = false;
      },
      (error) => {
        console.error('Error loading cars:', error);
        this.loading = false;
      }
    );
  }

  processCars(cars: any[]): any[] {
    return cars.map(car => {
      car.mainImage = car.image && car.image.length > 0 ? car.image[0] : this.defaultImage;
      car.image = car.mainImage;
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
                console.error('Error fetching reviewer info:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error fetching reviews:', error);
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
        console.log('Car added to favorites:', response);
      },
      error => {
        console.error('Error adding car to favorites:', error);
      }
    );
  }

  trackByCarId(index: number, car: any): number {
    return car.id;
  }
}
