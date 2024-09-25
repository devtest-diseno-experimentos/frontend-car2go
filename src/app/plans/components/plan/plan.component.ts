import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent {
  constructor(private router: Router) {}

  redirectToPaymentForm() {
    this.router.navigate(['/payment-form']);
  }
}
