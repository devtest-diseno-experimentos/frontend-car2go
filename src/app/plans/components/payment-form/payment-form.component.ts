import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../../service/plan.service';
import { SubscriptionService } from '../../service/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
})
export class PaymentFormComponent implements OnInit {
  selectedPlan: any;
  isSummaryVisible: boolean = false;

  constructor(
    private planService: PlanService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar for notifications
  ) {}

  ngOnInit(): void {
    // Get the selected plan from the service
    this.selectedPlan = this.planService.getPlan();
  }

  // Method to handle form submission
  onSubmit(): void {
    // Check if the user already has an active subscription
    this.subscriptionService.getMySubscription().subscribe(
      (subscription) => {
        if (subscription && subscription.status === 'PAID') {
          this.snackBar.open('You already have an active subscription.', 'Close', { duration: 3000 });
          this.router.navigate(['/profile']); // Redirect to profile if there's an active subscription
        } else {
          this.createNewSubscription();
        }
      },
      (error) => {
        if (error.status === 404) {
          // If the response is 404, it means no subscription exists, so create a new one.
          this.createNewSubscription();
        } else {
          this.snackBar.open('Error checking subscription status.', 'Close', { duration: 3000 });
        }
      }
    );
  }

  // Method to create a new subscription
  private createNewSubscription(): void {
    const subscriptionData = {
      price: this.selectedPlan.price,
      description: this.selectedPlan.name,
    };

    this.subscriptionService.createSubscription(subscriptionData).subscribe(
      () => {
        this.snackBar.open('Subscription created successfully.', 'Close', { duration: 3000 });
        this.router.navigate(['/profile']);
      },
      (error) => {
        this.snackBar.open('Error processing subscription.', 'Close', { duration: 3000 });
      }
    );
  }

  // Toggle visibility of the product summary on small screens
  toggleSummary(): void {
    this.isSummaryVisible = !this.isSummaryVisible;
    const summary = document.querySelector('.summary-column');
    if (summary) {
      summary.classList.toggle('active');
    }
  }
}
