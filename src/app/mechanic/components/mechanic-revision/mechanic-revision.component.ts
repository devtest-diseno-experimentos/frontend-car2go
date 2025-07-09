import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../services/review.service';
import { CarService } from '../../../cars/services/car/car.service';

@Component({
  selector: 'app-mechanic-revision',
  templateUrl: './mechanic-revision.component.html',
  styleUrls: ['./mechanic-revision.component.css']
})
export class MechanicRevisionComponent implements OnInit {
  pendingCars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  loading: boolean = true;
  carReviews: {[carId: number]: any} = {};
  reviewStatus: string = 'REPAIR_REQUESTED';

  constructor(
    private carService: CarService,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingCars();
  }

  loadPendingCars(): void {
    this.loading = true;
    this.carService.getCars().subscribe(
      (cars) => {
        this.pendingCars = cars
          .filter((car: any) => car.status === 'PENDING' || car.status === 'REPAIR_REQUESTED')
          .map((car: any) => {
            car.mainImage = car.image && car.image.length > 0 ? car.image[0] : this.defaultImage;
            car.image = car.mainImage;
            // Cargamos la revisión si el estado es REPAIR_REQUESTED
            if (car.status === 'REPAIR_REQUESTED') {
              this.loadCarReview(car.id);
            }
            return car;
          });
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching cars:', error);
        this.snackBar.open('Error fetching pending cars', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  loadCarReview(carId: number): void {
    this.reviewService.getReviewsByCarId(carId).subscribe(
      (review) => {
        if (review) {
          this.carReviews[carId] = review;
          // Asignar las notas existentes al coche
          const car = this.pendingCars.find(c => c.id === carId);
          if (car) {
            car.reviewNotes = review.notes;
            car.reviewId = review.id;
          }
        }
      },
      (error) => {
        console.error(`Error fetching review for car ${carId}:`, error);
      }
    );
  }

  handleReview(car: any, reviewNotes: string | undefined): void {
    if (!reviewNotes || !reviewNotes.trim()) {
      this.snackBar.open('Please add notes to the review.', 'Close', { duration: 3000 });
      return;
    }
    if (car.status === 'REPAIR_REQUESTED' && car.reviewId) {
      this.updateExistingReview(car, reviewNotes);
    } else {
      this.createNewReview(car, reviewNotes);
    }
  }

  updateExistingReview(car: any, reviewNotes: string): void {
    this.reviewService.updateReviewNotes(car.reviewId, reviewNotes).subscribe(
      () => {
        this.reviewService.updateReviewStatus(car.reviewId, this.reviewStatus).subscribe(
          () => {
            this.snackBar.open(`Review for ${car.brand} ${car.model} updated with status: ${this.reviewStatus}`, 'Close', { duration: 3000 });
            this.pendingCars = this.pendingCars.filter(pendingCar => pendingCar.id !== car.id);
          },
          (error) => {
            this.snackBar.open('Error updating the review status', 'Close', { duration: 3000 });
          }
        );
      },
      (error) => {
        this.snackBar.open('Error updating the review notes', 'Close', { duration: 3000 });
      }
    );
  }

  createNewReview(car: any, reviewNotes: string): void {
    const review = {
      vehicleId: car.id,
      notes: reviewNotes,
      status: this.reviewStatus
    };

    this.reviewService.createReview(review).subscribe(
      (reviewResponse) => {
        this.snackBar.open(`Review for ${car.brand} ${car.model} created with status: ${this.reviewStatus}`, 'Close', { duration: 3000 });
        this.pendingCars = this.pendingCars.filter(pendingCar => pendingCar.id !== car.id);
      },
      (error) => {
        console.error('Error creating the review:', error);
        this.snackBar.open('Error creating the review', 'Close', { duration: 3000 });
      }
    );
  }

}
