import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'https://car2go-fake-api.vercel.app/reviews';  // Endpoint separado para revisiones

  constructor(private http: HttpClient) {}

  // Obtener todas las revisiones
  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener revisiones de un coche específico
  getReviewsByCarId(carId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?carId=${carId}`);
  }

  // Crear una nueva revisión
  createReview(review: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, review);
  }

  // Actualizar una revisión existente
  updateReview(reviewId: number, review: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${reviewId}`, review);
  }

  // Eliminar una revisión
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${reviewId}`);
  }
}
