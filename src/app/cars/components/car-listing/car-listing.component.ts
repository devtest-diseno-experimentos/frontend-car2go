import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CarService } from "../../services/car/car.service";
import { FavoriteService } from "../../services/favorite-service/favorite.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-car-listing',
  templateUrl: './car-listing.component.html',
  styleUrls: ['./car-listing.component.css']
})
export class CarListingComponent implements OnInit {
  userRole: string = '';
  cars: any[] = [];
  paginatedCars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  pageSize: number = 4;
  currentPage: number = 1;

  constructor(
    private router: Router,
    private carService: CarService,
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';

    this.carService.getCars().subscribe(
      (data: any[]) => {
        this.cars = data.map(car => {
          if (Array.isArray(car.image) && car.image.length > 0) {
            car.images = car.image;
            car.mainImage = car.images[0];
          } else {
            car.mainImage = this.defaultImage;
            car.images = [this.defaultImage];
          }
          return car;
        });

        this.updatePaginatedCars();
      },
      (error) => {
        this.showSnackBar('Error fetching cars');
      }
    );
  }

  filteredCars() {
    return this.paginatedCars.filter(car => car.status === 'REVIEWED');
  }

  updatePaginatedCars() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedCars = this.cars.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCars();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.cars.length / this.pageSize);
  }

  addToFavorites(carId: number): void {
    this.favoriteService.addFavorite(carId).subscribe(
      response => {
        this.showSnackBar('Car added to favorites');
      },
      error => {
        this.showSnackBar('Error adding car to favorites');
      }
    );
  }

  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
