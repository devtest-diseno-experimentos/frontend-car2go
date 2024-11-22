import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite-service/favorite.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  paginatedCars: any[] = [];
  pageSize: number = 4;
  currentPage: number = 1;
  loading: boolean = true;

  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.favoriteService.getMyFavorites().subscribe(
      (favorites: any[]) => {
        this.favorites = favorites;
        this.updatePaginatedCars();
        this.loading = false;
      },
      (error) => {
        this.showSnackBar('Error fetching favorites');
        this.loading = false;
      }
    );
  }

  updatePaginatedCars() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedCars = this.favorites.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCars();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.favorites.length / this.pageSize);
  }

  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }

  removeFavorite(vehicleId: number) {
    this.favoriteService.deleteFavorite(vehicleId).subscribe(
      (response) => {
        this.favorites = this.favorites.filter(fav => fav.vehicle.id !== vehicleId);
        this.updatePaginatedCars();
        this.showSnackBar('Favorite removed');
      },
      (error) => {
        this.showSnackBar('Error removing favorite');
      }
    );
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
