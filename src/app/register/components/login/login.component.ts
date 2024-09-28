import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.username && this.password) {
      const credentials = { username: this.username, password: this.password };
      this.authService.login(credentials).subscribe(
        response => {
          console.log('Login successful:', response);
          const userRole = localStorage.getItem('userRole');
          if (userRole === 'seller') {
            this.router.navigate(['/plan']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error => {
          console.error('Error logging in:', error);
        }
      );
    } else {
      alert('Please fill in all fields before logging in.');
    }
  }
}
