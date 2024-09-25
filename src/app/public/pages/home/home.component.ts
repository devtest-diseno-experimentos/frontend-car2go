import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole: string = '';
  showForm: boolean = false;

  cars = [
    {
      id: 1,
      title: 'Perfect Sport Car',
      price: 1200,
      description: 'Leggings edison bulb hexagon, hashtag coloring book ethical echo park austin fam succulents.',
      year: 2018,
      speed: '160',
      mileage: '26.00',
      fuel: 'Petrol',
      image: 'assets/car_item_1.jpg',
      link: 'home'
    },
    {
      id: 2,
      title: 'Perfect Sport Car',
      price: 1200,
      description: 'Leggings edison bulb hexagon, hashtag coloring book ethical echo park austin fam succulents.',
      year: 2018,
      speed: '160',
      mileage: '26.00',
      fuel: 'Petrol',
      image: 'assets/default_image.jpg',
      link: 'home'
    }
  ];

  constructor() {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';
  }

  openModal() {
    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
  }

  addCar(newCar: any) {
    if (newCar) {
      const carData = {
        id: newCar.id,
        title: `${newCar.brand} ${newCar.model}`,
        price: newCar.price,
        description: newCar.description || 'No description provided',
        year: newCar.year,
        speed: newCar.speed,
        mileage: newCar.mileage,
        fuel: newCar.fuel,
        image: newCar.image,
        link: newCar.link
      };

      this.cars.push(carData);
      this.cars = [...this.cars];
      this.showForm = false;
    }
  }
}
//
