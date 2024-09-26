import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PlanService} from "../../service/plan.service";


@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  selectedPlan: any;

  constructor(private planService: PlanService, private router: Router) {}

  ngOnInit() {
    this.selectedPlan = this.planService.getPlan();
  }

  onSubmit() {
    this.router.navigate(['/home']);
  }
}
