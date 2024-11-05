import { Component } from '@angular/core';

@Component({
  selector: 'app-vehicle-payment-stepper',
  templateUrl: './vehicle-payment-stepper.component.html',
  styleUrls: ['./vehicle-payment-stepper.component.css']
})
export class VehiclePaymentStepperComponent {
  currentStep = 1;
  isLoading = false;

  userData = {
    name: 'Paola Del Rosario Abanto Sanchez',
    email: 'haxek16906-pepito.com',
    telephone: '',
    dni: ''
  };

  sellerData = {
    name: 'Paola Del Rosario Abanto Sanchez',
    email: 'haxek1690-ploncy.com',
    telephone: '+51 756 123 978',
    dni: '59272734'
  };

  buyerData = {
    name: 'Paola Del Rosario Abanto Sanchez',
    email: 'haxek16906-ploncy.com',
    telephone: '+51 432 756 678',
    dni: '12345678'
  };

  paymentMethods = {
    accountNumber: '',
    transactionNumber: ''
  };

  nextStep() {
    if (this.currentStep === 2) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.currentStep++;
      }, 5000);
    } else if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  confirmPayment() {
    alert('Pago confirmado. Gracias por su compra.');
  }

  getProgressWidth() {
    return `${((this.currentStep - 1) / 2) * 100}%`;
  }
}
