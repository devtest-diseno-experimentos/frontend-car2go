import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private cars = [
    {
      id: 1,
      title: 'Perfect Sport Car',
      price: 1200,
      description: 'Leggings edison bulb hexagon, hashtag coloring book ethical echo park austin fam succulents.',
      year: 2018,
      speed: '160p/h',
      mileage: '26.00km',
      fuel: 'Petrol',
      image: 'assets/car_item_1.jpg',
      transmission: 'Automatic',
      engine: 'V8',
      doors: 4,
      plate: 'ABC123',
      location: 'New York'
    },
    {
      id: 2,
      title: 'Perfect Sport Car',
      price: 1200,
      description: 'Leggings edison bulb hexagon, hashtag coloring book ethical echo park austin fam succulents.',
      year: 2018,
      speed: '160p/h',
      mileage: '26.00km',
      fuel: 'Petrol',
      image: 'assets/default_image.jpg',
      transmission: 'Manual',
      engine: 'V6',
      doors: 2,
      plate: 'XYZ789',
      location: 'Los Angeles'
    }
  ];

  getCars() {
    return this.cars;
  }

  getCarById(id: number) {
    return this.cars.find(car => car.id === id);
  }

  addCar(newCar: any) {
    this.cars.push(newCar);
  }
}
