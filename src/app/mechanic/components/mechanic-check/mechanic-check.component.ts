import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { CarService } from '../../../cars/services/car.service';
import { AuthService } from '../../../register/service/auth.service';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-mechanic-check',
  templateUrl: './mechanic-check.component.html',
  styleUrls: ['./mechanic-check.component.css']
})
export class MechanicCheckComponent implements OnInit {
  reviewedCars: any[] = [];
  user: any;

  constructor(
    private reviewService: ReviewService,
    private carService: CarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReviewedCars();
    this.loadUserData();
  }

  loadUserData(): void {
    const userId = +localStorage.getItem('userId')!;
    this.authService.getUserInfo(userId).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }

  loadReviewedCars(): void {
    this.reviewService.getAllReviews().subscribe(
      (reviews) => {
        const groupedCars = this.groupReviewsByCar(reviews);
        this.getCarsDetails(groupedCars);
      },
      (error) => {
        console.error('Error fetching reviewed cars:', error);
      }
    );
  }

  groupReviewsByCar(reviews: any[]): any[] {
    const grouped = reviews.reduce((acc, review) => {
      const carId = review.carId;
      if (!acc[carId]) {
        acc[carId] = {
          carId: carId,
          reviews: []
        };
      }
      acc[carId].reviews.push(review);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  getCarsDetails(carsGroupedByReview: any[]): void {
    const carDetailsRequests = carsGroupedByReview.map(carGroup => {
      return this.carService.getCarById(carGroup.carId).pipe(
        switchMap(carDetails => {
          const reviewUserRequests = carGroup.reviews.map((review: any) => {
            return this.authService.getUserInfo(+review.reviewedBy).pipe(
              map(userInfo => ({
                ...review,
                reviewerInfo: userInfo
              }))
            );
          });
          return forkJoin(reviewUserRequests).pipe(
            map(reviewsWithUserInfo => ({
              ...carDetails,
              reviews: reviewsWithUserInfo
            }))
          );
        })
      );
    });

    forkJoin(carDetailsRequests).subscribe(
      (carsWithDetails) => {
        this.reviewedCars = carsWithDetails;
      },
      (error) => {
        console.error('Error fetching car details:', error);
      }
    );
  }
}
