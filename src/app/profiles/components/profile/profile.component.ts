import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = {};
  userId: number | null = null;
  editMode: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.userId = +localStorage.getItem('id')!;

    if (this.userId) {
      this.profileService.getProfileByUserId(this.userId).subscribe(
        (profile) => {
          if (profile && profile.length > 0) {
            this.userData = profile[0];
          } else if (profile && profile.userId === this.userId) {
            this.userData = profile;
          }

          this.imagePreview = this.userData.photo;
        },
        (error) => {
          console.error('Error al obtener los datos del perfil:', error);
        }
      );
    } else {
      console.error('No se encontró el ID del usuario en el localStorage.');
    }
  }

  toggleEditMode(): void {
    if (this.editMode) {
      // Si estamos en modo edición, guardamos los cambios
      this.saveProfile();
    } else {
      // Cambiar a modo edición
      this.editMode = !this.editMode;
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.userData.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (this.userData.id) {
      this.profileService.updateUserProfile(this.userData.id, this.userData).subscribe(
        (response) => {
          this.editMode = false; // Salir del modo edición
        },
        (error) => {
          this.editMode = false; // Salir del modo edición
        }
      );
    } else {
      console.error('No se encontró el id al guardar el perfil');
    }
  }

}
