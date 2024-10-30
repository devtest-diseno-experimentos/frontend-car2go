import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, switchMap, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {SignInRequest} from "../model/sign-in.request";
import {SignInResponse} from "../model/sign-in.response";
import {SignUpRequest} from "../model/sign-up.request";
import {SignUpResponse} from "../model/sign-up.response";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  basePath: string = `${environment.serverBasePath}`;
  isProfileCreated: boolean = false;
  private varToken: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private idSignIn = new BehaviorSubject<string>('');
  private userRole = new BehaviorSubject<string>(''); // BehaviorSubject para el rol del usuario

  setProfileCreated(value: boolean) {
    this.isProfileCreated = value;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router, private http: HttpClient) {}

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  get currentUserRole() {
    return this.userRole.asObservable(); // Método para obtener el rol del usuario como un Observable
  }

  signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions);
  }

  signIn(signInRequest: SignInRequest): Observable<SignInResponse> {
    console.log(signInRequest);
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .pipe(
        switchMap((response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.setIdSignIn(response.id.toString());
          this.signedInUsername.next(response.username);
          localStorage.setItem('token', response.token);
          localStorage.setItem('isSignedIn', 'true'); // Almacenar el estado de la sesión en localStorage
          localStorage.setItem('userId', response.id.toString()); // Almacenar el ID del usuario en localStorage
          this.setToken(response.token);

          // Hacer una segunda solicitud para obtener el perfil del usuario
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.token}`
          });

          return this.http.get<any>(`${this.basePath}/users/${response.id}`, { headers }).pipe(
            tap((profile) => {
              const userRole = profile.roles && profile.roles.length > 0 ? profile.roles[0] : '';
              this.setUserRole(userRole);
              localStorage.setItem('userRole', userRole); // Almacenar el rol del usuario en localStorage
            }),
            catchError((error) => {
              console.error('Error fetching user profile:', error);
              return throwError(error);
            })
          );
        }),
        catchError((error) => {
          console.error(`Error while signing in: ${error}`);
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInUsername.next('');
          localStorage.removeItem('token');
          localStorage.removeItem('isSignedIn'); // Eliminar el estado de la sesión de localStorage
          localStorage.removeItem('userRole'); // Eliminar el rol del usuario de localStorage
          localStorage.removeItem('userId'); // Eliminar el ID del usuario de localStorage
          this.router.navigate(['/sign-in']).then();
          return throwError(error);
        })
      );
  }

  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    localStorage.removeItem('isSignedIn'); // Eliminar el estado de la sesión de localStorage
    localStorage.removeItem('userRole'); // Eliminar el rol del usuario de localStorage
    localStorage.removeItem('userId'); // Eliminar el ID del usuario de localStorage
    this.router.navigate(['/sign-in']).then();
    this.setProfileCreated(false);
    this.setToken('');
    this.setIdSignIn('');
    this.setUserRole(''); // Establecer el rol del usuario como vacío
  }

  loadSession() {
    const isSignedIn = localStorage.getItem('isSignedIn');
    if (isSignedIn === 'true') {
      this.signedIn.next(true);
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      // @ts-ignore
      this.setToken(token);
      if (userRole) {
        this.setUserRole(userRole); // Establecer el rol del usuario desde localStorage
      }
      if (userId) {
        this.setIdSignIn(userId); // Establecer el ID del usuario desde localStorage
      }
    } else {
      this.signedIn.next(false);
    }
  }

  setToken(token: string) {
    this.varToken.next(token);
  }

  getIdSignIn() {
    return this.idSignIn.value; // Devuelve el valor del BehaviorSubject
  }
  getUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  setIdSignIn(id: string) {
    this.idSignIn.next(id);
  }

  getToken(): Observable<string> {
    return this.varToken.asObservable();
  }

  setUserRole(role: string) {
    this.userRole.next(role); // Método para establecer el rol del usuario
  }
}
