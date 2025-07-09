import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl: string = `${environment.serverBasePath}/reviews`;

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getReviewsByCarId(carId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${carId}`);
  }

  createReview(review: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, review);
  }
  getReviewsByCurrentUser(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }

  updateReviewStatus(reviewId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${reviewId}/status`, status, {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain'
      }),
      responseType: 'text'
    });
  }

  updateReviewNotes(reviewId: number, notes: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${reviewId}/notes`, notes, {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain'
      }),
      responseType: 'text'
    });
  }

}
