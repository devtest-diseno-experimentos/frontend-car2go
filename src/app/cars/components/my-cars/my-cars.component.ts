import { Component, OnInit } from '@angular/core';
import { CarService } from "../../services/car.service";

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.component.html',
  styleUrls: ['./my-cars.component.css']
})
export class MyCarsComponent implements OnInit {
  cars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';

  constructor(private carService: CarService) {}

  ngOnInit() {
    const userId = +localStorage.getItem('userId')!;

    this.carService.getCarsByUserId(userId).subscribe(
      (data: any[]) => {
        this.cars = data.map(car => {
          // Verifica si car.image es un array y tiene imágenes
          if (Array.isArray(car.image) && car.image.length > 0) {
            car.images = car.image;
            car.mainImage = car.images[0];  // Asigna la primera imagen como principal
          } else {
            // Si no hay imágenes, usa una imagen predeterminada
            car.mainImage = this.defaultImage;
            car.images = [this.defaultImage];  // Asegura que haya un array de imágenes
          }
          return car;
        });
      },
      (error) => {
        console.error('Error al obtener los autos:', error);
      }
    );
  }


  deleteCar(carId: number) {
    this.carService.deleteCar(carId).subscribe(
      () => {
        console.log('Car deleted successfully');
        this.cars = this.cars.filter(car => car.id !== carId);
      },
      (error) => {
        if (error.status === 404) {
          console.error('Car not found:', error);
        } else {
          console.error('Error deleting car:', error);
        }
      }
    );
  }
}
