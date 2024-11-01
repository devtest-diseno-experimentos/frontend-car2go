import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { SignInRequest } from "../../model/sign-in.request";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import {catchError, map, of} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm!: FormGroup;
  hide: boolean = true;
  isSignedIn: boolean = false;
  httpOptions: any;

  private baseURL = environment.serverBasePath;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.authenticationService.isSignedIn.subscribe((isSignedIn) => {
      this.isSignedIn = isSignedIn;
    });
  }

  ngOnInit(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      })
    };

    this.signInForm = this.builder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSignInSubmit() {
    if (this.signInForm.invalid) return;

    const signInRequest: SignInRequest = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password
    };

    this.authenticationService.signIn(signInRequest).subscribe({
      next: () => {
        const userRole = localStorage.getItem('userRole');

        this.checkUserProfile().subscribe(hasProfile => {
          if (hasProfile) {
            if (userRole === 'ROLE_SELLER') {
              this.router.navigate(['/plan']);
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.router.navigate(['/profile-form']);
          }
        });
      },
      error: (error) => {
        console.error('Error during sign-in:', error);
      }
    });
  }

  private checkUserProfile() {
    return this.http.get<any>(`${this.baseURL}/profiles/me`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of(null);
      }),
      map(profile => !!profile)
    );
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSignOut() {
    this.authenticationService.signOut();
  }
}
