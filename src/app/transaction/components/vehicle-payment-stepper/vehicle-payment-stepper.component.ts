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
  currentStep = 1; // Controla el paso actual
  isLoading = false; // Controla el loader durante el envío de la oferta

  userData: any = {}; // Información del solicitante
  sellerData: any = {}; // Información del vendedor
  vehicleData: any = {}; // Información del vehículo
  sellerPaymentMethods: any[] = []; // Métodos de contacto del vendedor
  selectedPaymentMethod: any = null; // Método de contacto seleccionado

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

  // Cargar datos del perfil del solicitante
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

  // Cargar datos del vehículo
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

  // Cargar datos del vendedor
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

  // Avanzar al siguiente paso
  nextStep() {
    if (this.currentStep === 2 && !this.selectedPaymentMethod) {
      this.snackBar.open('Por favor, seleccione un método de contacto.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.currentStep === 2) {
      this.simulateProcessing(); // Simula el envío de la oferta
    } else if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  // Retroceder al paso anterior
  prevStep() {
    if (this.currentStep > 1 && !this.isLoading) {
      this.currentStep--;
    }
  }

  // Simulación de envío de oferta
  simulateProcessing() {
    this.isLoading = true; // Activa el loader
    setTimeout(() => {
      this.isLoading = false; // Desactiva el loader
      this.currentStep++; // Avanza al paso de confirmación
    }, 3000); // Simula un retraso de 3 segundos
  }

  // Confirmar y enviar la oferta
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
      offerStatus: 'PENDING', // Estado inicial de la oferta
    };

    this.isLoading = true; // Activa el loader durante la solicitud
    this.transactionService.createTransaction(offerData).subscribe(
      (response) => {
        this.isLoading = false; // Desactiva el loader al finalizar
        this.snackBar.open('Oferta enviada con éxito.', 'Cerrar', { duration: 3000 });
      },
      (error) => {
        this.isLoading = false; // Maneja errores y desactiva el loader
        this.snackBar.open('Error al enviar la oferta.', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    );
  }

  // Obtener el ancho de la barra de progreso
  getProgressWidth() {
    return `${((this.currentStep - 1) / 2) * 100}%`; // Ajusta el ancho en función de los pasos
  }
}
