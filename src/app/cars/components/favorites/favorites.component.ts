// src/app/cars/components/favorites/favorites.component.ts
import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite-service/favorite.service';
import { CarService } from '../../services/car.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  cars: any[] = [];
  paginatedCars: any[] = [];
  pageSize: number = 4;
  currentPage: number = 1;

  constructor(private router: Router,private favoriteService: FavoriteService, private carService: CarService) {}

  ngOnInit(): void {
    const userId = +localStorage.getItem('id')!;
    this.favoriteService.getFavoritesByUserId(userId).subscribe(
      (favorites: any[]) => {
        this.favorites = favorites;
        this.loadFavoriteCars();
      },
      (error) => {
        console.error('Error al obtener los favoritos:', error);
      }
    );
  }

  loadFavoriteCars(): void {
    this.favorites.forEach(favorite => {
      this.carService.getCarById(favorite.carId).subscribe(
        (car: any) => {
          this.cars.push(car);
          this.updatePaginatedCars();
          },
        (error) => {
          console.error('Error al obtener el carro:', error);
        }
      );
    });
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
  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }
  removeFavorite(carId: number) {
    this.favoriteService.deleteFavorite(carId).subscribe(
      (response) => {
        if (!response.error) {
          this.favorites = this.favorites.filter(fav => fav.carId !== carId);
          this.cars = this.cars.filter(car => car.id !== carId);
          this.updatePaginatedCars();
          console.log('Favorito eliminado:', response);
        } else {
          console.error('Error al eliminar el favorito:', response.error);
        }
      },
      (error) => {
        console.error('Error al eliminar el favorito:', error);
      }
    );
  }
}
