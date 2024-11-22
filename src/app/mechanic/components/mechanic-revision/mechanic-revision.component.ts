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

  review = {
    isApproved: false
  };

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
          .filter((car: any) => car.status === 'PENDING')
          .map((car: any) => {
            car.mainImage = car.image && car.image.length > 0 ? car.image[0] : this.defaultImage;
            car.image = car.mainImage;
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

  createCarReview(car: any, reviewNotes: string | undefined): void {
    if (!reviewNotes || !reviewNotes.trim()) {
      this.snackBar.open('Please add review notes before creating the review.', 'Close', { duration: 3000 });
      return;
    }

    const review = {
      vehicleId: car.id,
      notes: reviewNotes,
      approved: this.review.isApproved
    };

    this.reviewService.createReview(review).subscribe(
      (reviewResponse) => {
        this.snackBar.open(`Review for ${car.brand} ${car.model} created.`, 'Close', { duration: 3000 });
        this.pendingCars = this.pendingCars.filter((pendingCar) => pendingCar.id !== car.id);
      },
      (error) => {
        this.snackBar.open('Error creating review', 'Close', { duration: 3000 });
      }
    );
  }
}
