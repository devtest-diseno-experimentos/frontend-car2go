import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedRole: string = '';
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  onRoleChange(role: string) {
    this.selectedRole = role;
    this.updateCheckboxes();
  }

  updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = checkbox.value === this.selectedRole;
    });
  }

  onSignup() {
    if (this.name && this.email && this.password && this.selectedRole) {
      const user = { name: this.name, email: this.email, password: this.password, role: this.selectedRole };
      this.authService.register(user).subscribe(
        response => {
          console.log('User registered successfully:', response);
          if (this.selectedRole === 'seller') {
            this.router.navigate(['/plan']);
          } else {
            this.router.navigate(['/login']);
          }
        },
        error => {
          console.error('Error registering user:', error);
        }
      );
    } else {
      alert('Please fill in all fields before signing up.');
    }
  }
}
