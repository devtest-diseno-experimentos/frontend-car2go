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
  currentIndex: number = 0;
  autoScrollInterval: any;
  autoScrollTime: number = 5000;

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
      userId: ['']
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
          this.startAutoScroll();
        }
      );
    });

    this.userRole = localStorage.getItem('userRole') || '';
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  updateImages() {
    if (this.car) {
      this.images = this.car.images && this.car.images.length > 0 ? this.car.images : [this.defaultImage];
      this.mainImage = this.images[0];
      this.currentIndex = 0;
    } else {
      this.mainImage = this.defaultImage;
      this.images = [this.defaultImage];
    }
  }

  changeImage(index: number) {
    this.currentIndex = index;
    this.mainImage = this.images[index];
    this.restartAutoScroll();
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.mainImage = this.images[this.currentIndex];
    this.restartAutoScroll();
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.mainImage = this.images[this.currentIndex];
    this.restartAutoScroll();
  }

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
    this.stopAutoScroll();
    this.startAutoScroll();
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
        userId: this.car.userId
      };
      this.carService.updateCar(this.car.id, updatedCar).subscribe(
        (response) => {
          this.car = response;
          this.closeEditModal();
            console.log('Car updated', response);
        },
        (error) => {
          console.error('Error', error);
        }
      );
    }
  }

  requestReview() {
    const updatedCar = { ...this.car, status: 'pending inspection' };

    this.carService.updateCar(this.car.id, updatedCar).subscribe(
      (response) => {
        this.car = response;
        console.log('Car status updated to pending inspection');
      },
      (error) => {
        console.error('Error updating car status:', error);
      }
    );
  }

}
