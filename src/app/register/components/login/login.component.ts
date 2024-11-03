import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { SignInRequest } from "../../model/sign-in.request";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { catchError, map, of, switchMap } from "rxjs";
import { SubscriptionService } from "../../../plans/service/subscription.service";
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private http: HttpClient,
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar // Inject MatSnackBar
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

        this.checkUserProfile().pipe(
          switchMap(hasProfile => {
            if (!hasProfile) {
              // If the user doesn't have a profile, redirect to the profile creation page
              this.router.navigate(['/profile-form']);
              return of(null); // End the operation here if no profile exists
            } else if (userRole === 'ROLE_SELLER') {
              // If the user is a seller and has a profile, check the subscription
              return this.checkUserSubscription();
            } else {
              // For other roles, redirect to home if they have a profile
              this.router.navigate(['/home']);
              return of(null);
            }
          })
        ).subscribe(subscriptionStatus => {
          if (subscriptionStatus === 'has-subscription') {
            // If the user already has an active subscription, send them to home
            this.router.navigate(['/home']);
            this.snackBar.open('Login successful! Redirecting to home.', 'Close', { duration: 3000 });
          } else if (subscriptionStatus === 'no-subscription') {
            // If they have a profile but no subscription, redirect to the plans page
            this.router.navigate(['/plan']);
            this.snackBar.open('You need a subscription. Redirecting to plans.', 'Close', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        this.snackBar.open('Error during sign-in: Invalid credentials.', 'Close', { duration: 3000 });
      }
    });
  }

  // Check if the user has a profile
  private checkUserProfile() {
    return this.http.get<any>(`${this.baseURL}/profiles/me`, this.httpOptions).pipe(
      catchError(error => {
        this.snackBar.open('Error fetching user profile', 'Close', { duration: 3000 });
        return of(null);
      }),
      map(profile => !!profile) // Return true if there is a profile, false if not
    );
  }

  // Check if the user has an active subscription (with status 'PAID')
  private checkUserSubscription() {
    return this.subscriptionService.getMySubscription().pipe(
      map(subscription => {
        if (subscription && subscription.status === 'PAID') {
          return 'has-subscription';
        }
        return 'no-subscription';
      }),
      catchError(error => {
        this.snackBar.open('Error fetching user subscription', 'Close', { duration: 3000 });
        return of('no-subscription');
      })
    );
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSignOut() {
    this.authenticationService.signOut();
  }
}
