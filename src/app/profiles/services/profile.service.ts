import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl: string = `${environment.serverBasePath}/profiles`;

  constructor(private http: HttpClient) {}

  getProfileById(profileId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${profileId}`);
  }

  getCurrentProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }
}
