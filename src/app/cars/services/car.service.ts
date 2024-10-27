import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'https://car2go-fake-api.vercel.app/cars';

  constructor(private http: HttpClient) {}

  // Obtener todos los coches
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener coche por ID
  getCarById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Obtener coches por UserId
  getCarsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Añadir un coche nuevo
  addCar(newCar: any): Observable<any> {
    const userId = +localStorage.getItem('id')!;
    newCar.userId = userId;

    return this.http.post<any>(this.apiUrl, newCar);
  }

  // Eliminar coche por ID
  deleteCar(carId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${carId}`);
  }

  // Actualizar coche
  updateCar(carId: number, updatedCar: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${carId}`, updatedCar);
  }

  // Obtener coches pendientes de revisión (status: pending inspection)
  getPendingCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?status=pending inspection`);
  }

  markAsReviewed(carId: number): Observable<any> {
    // Solo actualizamos el estado del coche
    const patchBody = { status: 'reviewed' };

    console.log(`Sending PATCH request to update car ID ${carId} to status "reviewed"`);
    return this.http.patch<any>(`${this.apiUrl}/${carId}`, patchBody);
  }

  // Obtener coches revisados
  getReviewedCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?status=reviewed`);
  }
}
