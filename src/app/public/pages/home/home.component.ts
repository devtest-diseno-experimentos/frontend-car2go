import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CarService } from "../../../cars/services/car.service";
import {FavoriteService} from "../../../cars/services/favorite-service/favorite.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole: string = '';
  showForm: boolean = false;
  cars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';

  constructor(private router: Router, private carService: CarService, private favoriteService: FavoriteService) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';
    this.carService.getCars().subscribe(
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

  navigateToCarListingForm() {
    this.router.navigate(['/car-listing-form']);
  }

  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }

  addToFavorites(carId: number): void {
    this.favoriteService.addFavorite(carId).subscribe(
      response => {
        console.log('Car added to favorites:', response);
      },
      error => {
        console.error('Error adding car to favorites:', error);
      }
    );
  }
}
