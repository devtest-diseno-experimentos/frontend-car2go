import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  selectedRole: string = '';

  constructor(private router: Router) { }

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
    if (this.selectedRole) {
      localStorage.setItem('userRole', this.selectedRole);
      this.router.navigate(['/home']);
    } else {
      alert('Please select a role before signing up.');
    }
  }

}
