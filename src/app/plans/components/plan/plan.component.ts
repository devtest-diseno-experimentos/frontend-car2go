import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {PlanService} from "../../service/plan.service";


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent {
  plans = [
    {
      name: 'Basic Plan',
      price: 179,
      features: [
        '✔ Access to all listings',
        '✔ Customer support',
        '✔ Increased visibility in ads',
        '❌ 24/7 customer support',
        '❌ Discounts on featured listings',
        '❌ Advanced technical review',
        '❌ Commission discount'
      ]
    },
    {
      name: 'Standard Plan',
      price: 229,
      features: [
        '✔ Access to all listings',
        '✔ Customer support',
        '✔ Increased visibility in ads',
        '✔ Discounts on featured listings',
        '✔ Advanced technical review',
        '❌ 24/7 customer support',
        '❌ Commission discount'
      ]
    },
    {
      name: 'Premium Plan',
      price: 259,
      features: [
        '✔ Access to all listings',
        '✔ Customer support',
        '✔ 24/7 customer support',
        '✔ Increased visibility in ads',
        '✔ Discounts on featured listings',
        '✔ Advanced technical review',
        '✔ Commission discount'
      ]
    }
  ];

  constructor(private router: Router, private planService: PlanService) {}

  selectPlan(plan: any) {
    this.planService.setPlan(plan);
    this.router.navigate(['/payment-form']);
  }
}
