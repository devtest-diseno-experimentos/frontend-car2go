import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole: string = '';

  ngOnInit() {

    this.userRole = localStorage.getItem('userRole') || '';
  }

  cars = [
    {
      id: 1,
      title: 'Perfect Sport Car',
      price: 1200,
      status: 'For Rent',
      description: 'Leggings edison bulb hexagon, hashtag coloring book ethical echo park austin fam succulents.',
      year: 2018,
      speed: '160p/h',
      distance: '26.00km',
      fuel: 'Petrol',
      image: 'assets/car_item_1.jpg',
      link: 'home'
    },
    {
      id: 2,
      title: 'Perfect Sport Car',
      price: 49950,
      status: 'For Sale',
      description: 'Leggings edison bulb hexagon, hashtag coloring book ethical echo park austin fam succulents.',
      year: 2018,
      speed: '160p/h',
      distance: '26.00km',
      fuel: 'Petrol',
      image: 'assets/car_item_2.jpg',
      link: 'home'
    },
    {
      id: 3,
      title: 'Luxury Sedan',
      price: 75000,
      status: 'For Sale',
      description: 'A luxurious sedan with premium leather seats and a high-performance engine.',
      year: 2020,
      speed: '200p/h',
      distance: '15.00km',
      fuel: 'Diesel',
      image: 'assets/car_item_3.jpg',
      link: 'home'
    },
    {
      id: 4,
      title: 'Luxury Sedan',
      price: 75000,
      status: 'For Sale',
      description: 'A luxurious sedan with premium leather seats and a high-performance engine.',
      year: 2020,
      speed: '200p/h',
      distance: '15.00km',
      fuel: 'Diesel',
      image: 'assets/car_item_4.jpg',
      link: 'home'
    },
    {
      id: 5,
      title: 'Luxury Sedan',
      price: 75000,
      status: 'For Sale',
      description: 'A luxurious sedan with premium leather seats and a high-performance engine.',
      year: 2020,
      speed: '200p/h',
      distance: '15.00km',
      fuel: 'Diesel',
      image: 'assets/car_item_5.jpg',
      link: 'home'
    },
    {
      id: 6,
      title: 'Luxury Sedan',
      price: 75000,
      status: 'For Sale',
      description: 'A luxurious sedan with premium leather seats and a high-performance engine.',
      year: 2020,
      speed: '200p/h',
      distance: '15.00km',
      fuel: 'Diesel',
      image: 'assets/car_item_6.jpg',
      link: 'home'
    }
  ];
}
