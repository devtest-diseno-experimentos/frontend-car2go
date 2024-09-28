import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  selectedRole: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onRoleChange(role: string) {
    this.selectedRole = role;
    this.registerForm.get('role')?.setValue(role);
    this.updateCheckboxes();
  }

  updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = checkbox.value === this.selectedRole;
    });
  }

  onSignup() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      this.authService.register(user).subscribe(
        response => {
          if (response && response.success) {
            console.log('User registered successfully:', response);
            this.router.navigate([this.selectedRole === 'seller' ? '/plan' : '/login']);
          } else {
            this.snackBar.open('Registration failed. Please try again.', 'Close', {
              duration: 3000
            });
          }
        },
        error => {
          console.error('User registered successfully', error);
          this.snackBar.open('User registered successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/login']);
        }
      );
    } else {
      this.snackBar.open('Please fill in all fields correctly before signing up.', 'Close', {
        duration: 3000
      });
    }
  }
}
