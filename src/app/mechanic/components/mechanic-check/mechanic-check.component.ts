import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../cars/services/car.service';  // Servicio para manejar coches
import { ReviewService } from '../../services/review.service';  // Servicio para manejar revisiones

@Component({
  selector: 'app-mechanic-check',
  templateUrl: './mechanic-check.component.html',
  styleUrls: ['./mechanic-check.component.css']
})
export class MechanicCheckComponent implements OnInit {
  pendingCars: any[] = [];
  mechanicId: string = localStorage.getItem('id') || 'mechanic-123';  // Obtener ID del mecánico desde localStorage

  constructor(private carService: CarService, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadPendingCars();
  }

  // Cargar coches pendientes de revisión
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

  // Método 1: Actualizar el estado del coche a "reviewed"
  updateCarStatus(car: any): void {
    this.carService.markAsReviewed(car.id).subscribe(
      (carResponse) => {
        console.log('Car status updated to reviewed:', carResponse);

        // Actualizar el estado del coche a "reviewed" visualmente
        car.status = 'reviewed';
        alert(`Car ${car.brand} ${car.model} marked as reviewed.`);
      },
      (error) => {
        console.error('Error updating car status:', error);
      }
    );
  }

  // Método 2: Crear una nueva revisión
  createCarReview(car: any, reviewNotes: string): void {
    if (!reviewNotes.trim()) {
      alert('Please add review notes before creating the review.');
      return;
    }

    // Crear el objeto de revisión
    const review = {
      carId: car.id,  // Relacionar con el coche
      reviewedBy: this.mechanicId,  // ID del mecánico desde localStorage
      reviewDate: new Date().toISOString(),  // Fecha de revisión
      notes: reviewNotes  // Notas de la revisión
    };

    // Crear la revisión en el endpoint de /reviews
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
