import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  // Usa la URL base de tu backend en lugar de la fake API
  private apiUrl = 'http://localhost:8080/api/v1/vehicle';

  constructor(private http: HttpClient) {}

  // Obtener todos los coches
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Obtener coche por ID
  getCarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Obtener coches por UserId (profileId)
  getCarsByUserId(profileId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all/vehicles/profile/${profileId}`);
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
    return this.http.get<any[]>(`${this.apiUrl}/location/pending inspection`);
  }

  // Marcar coche como revisado
  markAsReviewed(carId: number): Observable<any> {
    const patchBody = { status: 'reviewed' };
    return this.http.put<any>(`${this.apiUrl}/${carId}`, patchBody);
  }

  // Obtener coches revisados
  getReviewedCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/location/reviewed`);
  }
}
