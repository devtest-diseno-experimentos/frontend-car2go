import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../cars/services/car/car.service';
import { ProfileService } from '../../../profiles/services/profile.service';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vehicle-payment-stepper',
  templateUrl: './vehicle-payment-stepper.component.html',
  styleUrls: ['./vehicle-payment-stepper.component.css'],
})
export class VehiclePaymentStepperComponent implements OnInit {
  currentStep = 1;
  isLoading = false;

  userData: any = {};
  sellerData: any = {};
  vehicleData: any = {};
  sellerPaymentMethods: any[] = [];
  selectedPaymentMethod: any = null;

  constructor(
    private carService: CarService,
    private profileService: ProfileService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadVehicleData();
  }

  loadUserProfile() {
    this.profileService.getCurrentProfile().subscribe(
      (profile) => {
        this.userData = {
          name: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
          telephone: profile.phone,
          dni: profile.dni,
        };
      },
      (error) => {
        this.snackBar.open('Error al cargar el perfil del solicitante.', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    );
  }

  loadVehicleData() {
    const vehicleId = Number(this.route.snapshot.paramMap.get('vehicleId'));
    if (!vehicleId) {
      this.snackBar.open('No se encontró el ID del vehículo.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.carService.getCarById(vehicleId).subscribe(
      (vehicle) => {
        this.vehicleData = vehicle;

        const sellerProfileId = vehicle.profileId;
        if (sellerProfileId) {
          this.loadSellerProfile(sellerProfileId);
        } else {
          this.snackBar.open('No se encontró el vendedor para este vehículo.', 'Cerrar', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error al cargar los datos del vehículo.', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    );
  }

  loadSellerProfile(profileId: number) {
    this.profileService.getProfileById(profileId).subscribe(
      (profile) => {
        this.sellerData = {
          name: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
          telephone: profile.phone,
          dni: profile.dni,
        };

        if (profile.paymentMethods && profile.paymentMethods.length > 0) {
          this.sellerPaymentMethods = profile.paymentMethods;
        } else {
          this.snackBar.open('El vendedor no tiene métodos de contacto configurados.', 'Cerrar', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error al cargar el perfil del vendedor.', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    );
  }

  nextStep() {
    if (this.currentStep === 2 && !this.selectedPaymentMethod) {
      this.snackBar.open('Por favor, seleccione un método de contacto.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.currentStep === 2) {
      this.simulateProcessing();
    } else if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1 && !this.isLoading) {
      this.currentStep--;
    }
  }

  simulateProcessing() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.currentStep++;
    }, 3000);
  }

  confirmOffer() {
    const offerData = {
      vehicleId: this.vehicleData.id,
      buyer: {
        name: this.userData.name,
        email: this.userData.email,
        phone: this.userData.telephone,
      },
      seller: {
        name: this.sellerData.name,
        email: this.sellerData.email,
        phone: this.sellerData.telephone,
      },
      contactMethod: this.selectedPaymentMethod?.type,
      contactDetails: this.selectedPaymentMethod?.details,
      offerStatus: 'PENDING',
    };

    this.isLoading = true;
    this.transactionService.createTransaction(offerData).subscribe(
      (response) => {
        this.isLoading = false;
        this.snackBar.open('Oferta enviada con éxito.', 'Cerrar', { duration: 3000 });
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al enviar la oferta.', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    );
  }

  getProgressWidth() {
    return `${((this.currentStep - 1) / 2) * 100}%`;
  }
}
