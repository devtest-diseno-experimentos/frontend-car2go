import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-mechanic-revision',
  templateUrl: './mechanic-revision.component.html',
  styleUrls: ['./mechanic-revision.component.css']
})
export class MechanicRevisionComponent implements OnInit {
  reviewedCars: any[] = [];

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviewedCars();
  }

  // Cargar los coches que han sido revisados
  loadReviewedCars(): void {
    this.reviewService.getAllReviews().subscribe(
      (reviews) => {
        // Agrupar las revisiones por coche
        this.reviewedCars = this.groupReviewsByCar(reviews);
      },
      (error) => {
        console.error('Error fetching reviewed cars:', error);
      }
    );
  }

  // Agrupar las revisiones por coche
  groupReviewsByCar(reviews: any[]): any[] {
    const grouped = reviews.reduce((acc, review) => {
      const carId = review.carId;
      if (!acc[carId]) {
        acc[carId] = {
          carId: carId,
          brand: review.carBrand,  // Datos del coche, si están disponibles
          model: review.carModel,
          image: review.carImage,
          reviews: []
        };
      }
      acc[carId].reviews.push(review);
      return acc;
    }, {});

    // Convertir el objeto agrupado en un array
    return Object.values(grouped);
  }
}
