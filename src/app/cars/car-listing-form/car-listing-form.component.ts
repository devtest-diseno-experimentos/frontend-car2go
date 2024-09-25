import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from '../services/car.service'; // Importa el servicio

@Component({
  selector: 'app-car-listing-form',
  templateUrl: './car-listing-form.component.html',
  styleUrls: ['./car-listing-form.component.css']
})
export class CarListingFormComponent {
  @Output() formClosed = new EventEmitter<void>();
  carForm: FormGroup;
  photos: File[] = [];
  photoPreviews: string[] = [];
  selectedImage: string = '';
  showImageModal: boolean = false;
  showPreviewModal: boolean = false;

  constructor(private fb: FormBuilder, private carService: CarService) {
    this.carForm = this.fb.group({
      name: ['Juan Pérez', Validators.required],
      phone: ['5551234567', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: ['juan.perez@example.com', [Validators.required, Validators.email]],
      brand: ['Toyota', Validators.required],
      model: ['Corolla', Validators.required],
      color: ['White', Validators.required],
      year: ['2018', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      price: [15000, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      transmission: ['Automatic', Validators.required],
      engine: ['2.0L', Validators.required],
      mileage: [45000, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      doors: ['4', Validators.required],
      plate: ['ABC1234', Validators.required],
      location: ['Mexico City', Validators.required],
      description: ['Vehicle in excellent condition, single owner, all services done at the dealership. Includes 4 new tires.', Validators.required],
      image: ['assets/default_image.jpg'],
      fuel: ['Gasoline', Validators.required],
      speed: [180, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    this.photos = [];
    this.photoPreviews = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      this.photos.push(selectedFiles[i]);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreviews.push(e.target.result);
      };
      reader.readAsDataURL(selectedFiles[i]);
    }
  }

  openImageModal(preview: string) {
    this.selectedImage = preview;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  openPreviewModal() {
    this.showPreviewModal = true;
  }

  closePreviewModal() {
    this.showPreviewModal = false;
  }

  removeImage(index: number) {
    this.photoPreviews.splice(index, 1);
    this.photos.splice(index, 1);
  }

  onSubmit() {
    if (this.carForm.valid) {
      const newCar = this.carForm.value;
      newCar.id = Date.now();

      newCar.title = `${newCar.brand} ${newCar.model}`;

      if (this.photoPreviews.length > 0) {
        newCar.image = this.photoPreviews[0];
      } else {
        newCar.image = 'assets/default_image.jpg';
      }

      this.carService.addCar(newCar);
      this.carForm.reset();
      this.photos = [];
      this.photoPreviews = [];


      this.formClosed.emit();
    }
  }
}
