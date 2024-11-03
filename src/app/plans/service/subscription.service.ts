import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/api/v1/subscription';

  constructor(private http: HttpClient) {}

  getMySubscription(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  createSubscription(subscriptionData: any): Observable<any> {
    return this.http.post(this.apiUrl, subscriptionData);
  }

  cancelMySubscription(): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/cancel`, {});
  }
}
