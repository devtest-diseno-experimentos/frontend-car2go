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
    const userId = +localStorage.getItem('id')!;
    this.carService.getCarsByUserId(userId).subscribe(
      (data: any[]) => {
        this.cars = data.map(car => {
          car.image = car.image || this.defaultImage;
          car.images = car.images && car.images.length > 0 ? car.images : [this.defaultImage];
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
