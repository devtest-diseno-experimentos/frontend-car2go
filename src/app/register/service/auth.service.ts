import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://car2go-fake-api.vercel.app/users';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user).pipe(
      tap(response => {
        console.log('Usuario registrado con éxito:', response);
        if (response) {
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('id', response.id);
        }
      }),
      catchError(error => {
        console.error('Error registering user:', error);
        return throwError(error);
      })
    );
  }


  login(credentials: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${credentials.username}&password=${credentials.password}`).pipe(
      tap(users => {
        if (users.length > 0) {
          const user = users[0];
          console.log('Login exitoso:', user);

          localStorage.setItem('userRole', user.role);
          localStorage.setItem('id', user.id);
        } else {
          console.error('Error en el login: Usuario o contraseña incorrectosdddd');
        }
      })
    );
  }

  getUserInfo(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('id');
    console.log('Sesión cerrada');
  }



}
