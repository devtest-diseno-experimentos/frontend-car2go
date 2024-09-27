import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://car2go-fake-api.vercel.app/users';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      switchMap(users => {
        const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
        user.id = maxId + 1;
        return this.http.post<any>(this.apiUrl, user);
      }),
      tap(response => {
        console.log('Usuario registrado con éxito:', response);
        if (response) {
          localStorage.setItem('authToken', 'fake-jwt-token');
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('id', response.id);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${credentials.username}&password=${credentials.password}`).pipe(
      tap(users => {
        if (users.length > 0) {
          const user = users[0];
          console.log('Login exitoso:', user);


          localStorage.setItem('authToken', 'fake-jwt-token'); // Token simulado
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('id', user.id);
        } else {
          console.error('Error en el login: Usuario o contraseña incorrectos');
        }
      })
    );
  }

  getUserInfo(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('id');
    console.log('Sesión cerrada');
  }


  getToken(): string | null {
    return localStorage.getItem('authToken');
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
