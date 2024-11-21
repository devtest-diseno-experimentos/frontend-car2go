import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from '../../services/car/car.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-car-listing-form',
  templateUrl: './car-listing-form.component.html',
  styleUrls: ['./car-listing-form.component.css']
})
export class CarListingFormComponent implements OnInit {
  @Output() formClosed = new EventEmitter<void>();
  @Output() carAdded = new EventEmitter<any>();
  carForm: FormGroup;
  photos: File[] = [];
  photoPreviews: string[] = [];
  showPreviewModal: boolean = false;
  showPublicationModal: boolean = false;
  currentImageIndex: number = 0;
  previewImageIndex: number = 0;
  defaultImage: string = 'assets/default_image.jpg';
  userData: any;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.carForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      phone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
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
      image: [this.defaultImage],
      fuel: ['Gasoline', Validators.required],
      speed: [180, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`${environment.serverBasePath}/profiles/me`, { headers })
      .pipe(
        tap(profileData => {
          this.userData = profileData;
          this.carForm.patchValue({
            name: profileData.firstName || '',
            phone: profileData.phone || '',
            email: profileData.email || ''
          });
        }),
        catchError(error => {
          this.snackBar.open('Error fetching profile data', 'Close', { duration: 3000 });

          return of(null);
        })
      )
      .subscribe();
  }

  onFileSelected(event: any) {
    const selectedFiles = Array.from(event.target.files) as File[];
    this.photos = [];
    this.photoPreviews = [];

    selectedFiles.forEach((file) => {
      this.photos.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    this.currentImageIndex = 0;
  }

  removeImage(index: number) {
    this.photoPreviews.splice(index, 1);
    this.photos.splice(index, 1);
    if (this.currentImageIndex >= this.photoPreviews.length) {
      this.currentImageIndex = this.photoPreviews.length - 1;
    }
  }

  openPreviewModal(index: number) {
    this.showPreviewModal = true;
    this.previewImageIndex = index;
    document.body.style.overflow = 'hidden';
  }

  closePreviewModal() {
    this.showPreviewModal = false;
    document.body.style.overflow = 'auto';
  }

  prevPreviewImage() {
    if (this.previewImageIndex > 0) {
      this.previewImageIndex--;
    } else {
      this.previewImageIndex = this.photoPreviews.length - 1;
    }
  }

  nextPreviewImage() {
    if (this.previewImageIndex < this.photoPreviews.length - 1) {
      this.previewImageIndex++;
    } else {
      this.previewImageIndex = 0;
    }
  }

  toggleZoom(event: MouseEvent) {
    const image = event.currentTarget as HTMLElement;
    if (image.classList.contains('zoomed')) {
      image.classList.remove('zoomed');
      image.style.transformOrigin = 'center center';
    } else {
      image.classList.add('zoomed');
      this.moveZoom(event);
    }
  }

  moveZoom(event: MouseEvent) {
    const image = event.currentTarget as HTMLElement;
    if (image.classList.contains('zoomed')) {
      const rect = image.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    }
  }

  openPublicationPreview() {
    this.showPublicationModal = true;
    document.body.style.overflow = 'hidden';
  }

  closePublicationModal() {
    this.showPublicationModal = false;
    document.body.style.overflow = 'auto';
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.photoPreviews, event.previousIndex, event.currentIndex);
    moveItemInArray(this.photos, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    if (this.carForm.valid) {
      this.carForm.get('name')?.enable();
      this.carForm.get('phone')?.enable();
      this.carForm.get('email')?.enable();

      const newCar = this.carForm.value;

      if (this.photoPreviews.length > 0) {
        newCar.image = this.photoPreviews[0];
        newCar.images = this.photoPreviews;
      } else {
        newCar.image = this.defaultImage;
        newCar.images = [this.defaultImage];
      }

      this.carService.addCar(newCar).subscribe(
        (response) => {
          this.snackBar.open('Car added successfully!', 'Close', { duration: 3000 });
          this.carForm.reset();
          this.photos = [];
          this.photoPreviews = [];
          this.carAdded.emit(response);
          this.formClosed.emit();
          this.router.navigate(['/my-cars']);
        },
        (error) => {
          this.snackBar.open('Error adding car', 'Close', { duration: 3000 });
          console.error("Error adding car:", error);
        }
      );

      this.carForm.get('name')?.disable();
      this.carForm.get('phone')?.disable();
      this.carForm.get('email')?.disable();
    } else {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
    }
  }
}
