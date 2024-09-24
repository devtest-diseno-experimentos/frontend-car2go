import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-listing-form',
  templateUrl: './car-listing-form.component.html',
  styleUrls: ['./car-listing-form.component.css']
})
export class CarListingFormComponent {
  @Output() carAdded = new EventEmitter<any>();
  carForm: FormGroup;
  photos: File[] = [];
  photoPreviews: string[] = [];
  selectedImage: string = '';
  showImageModal: boolean = false;
  showPreviewModal: boolean = false;

  constructor(private fb: FormBuilder) {
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', Validators.required],
      price: [0, Validators.required],
      transmission: ['', Validators.required],
      engine: ['', Validators.required],
      mileage: ['', Validators.required],
      doors: ['', Validators.required],
      plate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      fuel: ['', Validators.required],
      speed: ['', Validators.required],
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
      newCar.photos = this.photos;

      if (this.photoPreviews.length > 0) {
        newCar.image = this.photoPreviews[0];
      } else {
        newCar.image = 'assets/default_image.jpg';
      }

      this.carAdded.emit(newCar);
      this.carForm.reset();
      this.photos = [];
      this.photoPreviews = [];
    }
  }
}
