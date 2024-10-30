import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'https://car2go-fake-api.vercel.app/reviews';

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getReviewsByCarId(carId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?carId=${carId}`);
  }

  createReview(review: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, review);
  }

  updateReview(reviewId: number, review: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${reviewId}`, review);
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${reviewId}`);
  }
}
