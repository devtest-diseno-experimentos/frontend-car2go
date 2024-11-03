import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:8080/api/v1/vehicle';

  constructor(private http: HttpClient) {}

  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getCarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getCarsByUserId(profileId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all/vehicles/profile/${profileId}`);
  }

  addCar(newCar: any): Observable<any> {
    const userId = +localStorage.getItem('userId')!;
    newCar.userId = userId;

    return this.http.post<any>(this.apiUrl, newCar);
  }

  deleteCar(carId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${carId}`);
  }

  updateCar(carId: number, updatedCar: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${carId}`, updatedCar);
  }
}
