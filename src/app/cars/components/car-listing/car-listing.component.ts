import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CarService} from "../../services/car.service";
import {FavoriteService} from "../../services/favorite-service/favorite.service";

@Component({
  selector: 'app-car-listing',
  templateUrl: './car-listing.component.html',
  styleUrls: ['./car-listing.component.css']
})
export class CarListingComponent implements OnInit {
  userRole: string = '';
  showForm: boolean = false;
  cars: any[] = [];
  paginatedCars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  pageSize: number = 4;
  currentPage: number = 1;

  constructor(private router: Router, private carService: CarService, private favoriteService: FavoriteService) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';

    this.carService.getCars().subscribe(
      (data: any[]) => {
        this.cars = data.map(car => {
          // Verifica si car.image es un array y tiene imágenes
          if (Array.isArray(car.image) && car.image.length > 0) {
            car.images = car.image;  // Mantiene las imágenes tal cual
            car.mainImage = car.images[0];  // Asigna la primera imagen como principal
          } else {
            // Si no hay imágenes, usa una imagen predeterminada
            car.mainImage = this.defaultImage;
            car.images = [this.defaultImage];  // Asegura que haya un array de imágenes
          }
          return car;
        });

        // Actualiza la paginación después de cargar los autos
        this.updatePaginatedCars();
      },
      (error) => {
        console.error('Error al obtener los autos:', error);
      }
    );
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
        console.log('Car added to favorites:', response);
      },
      error => {
        console.error('Error adding car to favorites:', error);
      }
    );
  }
  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }
}
