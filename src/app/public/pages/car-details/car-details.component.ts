import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../../../cars/services/car.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit, OnDestroy {
  car: any;
  userRole: string = '';
  mainImage: string = '';
  images: string[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  carForm: FormGroup;
  isModalOpen: boolean = false;
  currentIndex: number = 0; // Índice actual de la imagen
  autoScrollInterval: any;  // Variable para manejar el auto-scroll
  autoScrollTime: number = 5000; // Tiempo de cambio automático (5 segundos)

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private fb: FormBuilder
  ) {
    this.carForm = this.fb.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      transmission: ['', Validators.required],
      engine: ['', Validators.required],
      mileage: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      doors: ['', Validators.required],
      plate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      fuel: ['', Validators.required],
      speed: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      images: [[]],
      userId: ['']  // Agrega el userId al formulario
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const carId = +params.get('id')!;
      this.carService.getCarById(carId).subscribe(
        (data: any) => {
          this.car = data;
          this.updateImages();
          this.populateForm();
          this.startAutoScroll();  // Inicia el auto-scroll al cargar las imágenes
        }
      );
    });

    this.userRole = localStorage.getItem('userRole') || '';
  }

  ngOnDestroy() {
    this.stopAutoScroll();  // Detiene el auto-scroll al destruir el componente
  }

  updateImages() {
    if (this.car) {
      this.images = this.car.images && this.car.images.length > 0 ? this.car.images : [this.defaultImage];
      this.mainImage = this.images[0]; // Inicia con la primera imagen
      this.currentIndex = 0; // Reinicia el índice
    } else {
      this.mainImage = this.defaultImage;
      this.images = [this.defaultImage];
    }
  }

  changeImage(index: number) {
    this.currentIndex = index;
    this.mainImage = this.images[index];
    this.restartAutoScroll();  // Reinicia el auto-scroll después de la interacción
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.mainImage = this.images[this.currentIndex];
    this.restartAutoScroll();  // Reinicia el auto-scroll después de la interacción
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.mainImage = this.images[this.currentIndex];
    this.restartAutoScroll();  // Reinicia el auto-scroll después de la interacción
  }

  // Auto-scroll
  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.nextImage();
    }, this.autoScrollTime);
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  restartAutoScroll() {
    this.stopAutoScroll();  // Pausa el auto-scroll
    this.startAutoScroll();  // Lo reinicia después de la interacción
  }

  openEditModal(): void {
    this.isModalOpen = true;
  }

  closeEditModal(): void {
    this.isModalOpen = false;
  }

  populateForm() {
    if (this.car) {
      this.carForm.patchValue(this.car);
      this.carForm.get('images')?.setValue(this.car.images || []);
    }
  }

  editCar() {
    if (this.carForm.valid) {
      const updatedCar = {
        ...this.carForm.value,
        images: this.images,
        userId: this.car.userId  // Asegúrate de incluir el userId
      };
      this.carService.updateCar(this.car.id, updatedCar).subscribe(
        (response) => {
          this.car = response;
          this.closeEditModal();
          console.log('Coche actualizado:', response);
        },
        (error) => {
          console.error('Error al actualizar el coche:', error);
        }
      );
    }
  }
}
