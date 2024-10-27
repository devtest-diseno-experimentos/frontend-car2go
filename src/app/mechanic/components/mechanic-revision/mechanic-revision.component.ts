import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { CarService } from '../../../cars/services/car.service';  // Importar CarService
import {forkJoin, map} from 'rxjs';  // Para combinar múltiples observables

@Component({
  selector: 'app-mechanic-revision',
  templateUrl: './mechanic-revision.component.html',
  styleUrls: ['./mechanic-revision.component.css']
})
export class MechanicRevisionComponent implements OnInit {
  reviewedCars: any[] = [];

  constructor(private reviewService: ReviewService, private carService: CarService) {}

  ngOnInit(): void {
    this.loadReviewedCars();
  }

  // Cargar los coches que han sido revisados
  loadReviewedCars(): void {
    this.reviewService.getAllReviews().subscribe(
      (reviews) => {
        // Agrupar las revisiones por coche
        const groupedCars = this.groupReviewsByCar(reviews);

        // Obtener los detalles de cada coche revisado
        this.getCarsDetails(groupedCars);
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
          reviews: []  // Agrupamos las revisiones por coche
        };
      }
      acc[carId].reviews.push(review);
      return acc;
    }, {});

    // Convertir el objeto agrupado en un array
    return Object.values(grouped);
  }

  // Obtener los detalles completos de los coches usando el CarService
  getCarsDetails(carsGroupedByReview: any[]): void {
    const carDetailsRequests = carsGroupedByReview.map(carGroup => {
      return this.carService.getCarById(carGroup.carId).pipe(
        // Combinar los datos del coche con sus revisiones
        map(carDetails => ({
          ...carDetails,
          reviews: carGroup.reviews  // Agregar las revisiones correspondientes
        }))
      );
    });

    // Ejecutar todas las solicitudes para obtener los detalles de los coches
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
