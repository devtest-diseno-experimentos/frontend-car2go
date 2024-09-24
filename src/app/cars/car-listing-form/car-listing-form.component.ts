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
      name: ['', ],
      phone: ['', ],
      email: ['', Validators.email],
      brand: ['', ],
      model: ['', ],
      color: ['', ],
      year: ['', ],
      price: [0, ],
      transmission: ['', ],
      engine: ['', ],
      mileage: ['', ],
      doors: ['', ],
      plate: ['', ],
      location: ['', ],
      description: ['', ],
      image: ['', ],
      fuel: ['', ],
      speed: ['', ],
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
