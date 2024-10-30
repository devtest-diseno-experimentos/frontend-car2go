import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../../service/plan.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  selectedPlan: any;
  isSummaryVisible: boolean = false;

  constructor(private planService: PlanService, private router: Router) {}

  ngOnInit() {
    this.selectedPlan = this.planService.getPlan();
  }

  // Método para manejar el envío del formulario de pago
  onSubmit() {
    this.router.navigate(['/home']);
  }

  // Método para alternar la visibilidad del resumen de productos en pantallas pequeñas
  toggleSummary() {
    this.isSummaryVisible = !this.isSummaryVisible;
    const summary = document.querySelector('.summary-column');
    if (summary) {
      summary.classList.toggle('active');
    }
  }
}
