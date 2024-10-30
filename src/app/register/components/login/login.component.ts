import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe(
        response => {
          this.snackBar.open('Success', 'Close', {
            duration: 3000,
          });
          const userRole = localStorage.getItem('userRole');
          if (userRole === 'seller') {
            this.router.navigate(['/plan']);
          } else {
            this.router.navigate(['/profile-form']);
          }
        },
      );
    } else {
      this.snackBar.open('Please fill in all fields correctly before logging in.', 'Close', {
        duration: 3000,
      });
    }
  }
}
