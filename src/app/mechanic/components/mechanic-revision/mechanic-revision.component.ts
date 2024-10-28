import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { CarService } from '../../../cars/services/car.service';

@Component({
  selector: 'app-mechanic-revision',
  templateUrl: './mechanic-revision.component.html',
  styleUrls: ['./mechanic-revision.component.css']
})
export class MechanicRevisionComponent implements OnInit {
  pendingCars: any[] = [];
  mechanicId: string = localStorage.getItem('id') || 'mechanic-123';

  constructor(private carService: CarService, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadPendingCars();
  }

  loadPendingCars(): void {
    this.carService.getPendingCars().subscribe(
      (cars) => {
        this.pendingCars = cars;
      },
      (error) => {
        console.error('Error fetching pending cars:', error);
      }
    );
  }

  updateCarStatus(car: any): void {
    if (car.status === 'reviewed') {
      alert(`Car ${car.brand} ${car.model} is already marked as reviewed.`);
      return;
    }

    this.carService.markAsReviewed(car.id).subscribe(
      (carResponse) => {
        console.log('Car status updated to reviewed:', carResponse);

        car.status = 'reviewed';
        alert(`Car ${car.brand} ${car.model} marked as reviewed.`);
      },
      (error) => {
        console.error('Error updating car status:', error);
      }
    );
  }

  createCarReview(car: any, reviewNotes: string): void {
    if (!reviewNotes.trim()) {
      alert('Please add review notes before creating the review.');
      return;
    }


    const review = {
      carId: car.id,
      reviewedBy: this.mechanicId,
      reviewDate: new Date().toISOString(),
      notes: reviewNotes
    };


    this.reviewService.createReview(review).subscribe(
      (reviewResponse) => {
        console.log('Review created successfully:', reviewResponse);
        alert(`Review for ${car.brand} ${car.model} created.`);
      },
      (error) => {
        console.error('Error creating review:', error);
      }
    );
  }
}
