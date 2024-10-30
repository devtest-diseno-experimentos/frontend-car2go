import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = {}; // Aquí se almacenarán los datos del perfil
  userId: number | null = null; // ID del usuario logueado
  editMode: boolean = false; // Modo edición
  selectedFile: File | null = null; // Archivo seleccionado para la imagen
  imagePreview: string | ArrayBuffer | null = null; // Vista previa de la imagen seleccionada

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    // Obtener el ID del usuario logueado desde localStorage
    this.userId = +localStorage.getItem('id')!;

    if (this.userId) {
      // Llamar al servicio para obtener el perfil asociado al userId
      this.profileService.getProfileByUserId(this.userId).subscribe(
        (profile) => {
          if (profile && profile.length > 0) {
            this.userData = profile[0];  // Asignar el primer perfil al userData
          } else if (profile && profile.userId === this.userId) {
            this.userData = profile; // Asignar los datos si es un objeto único
          }

          // Asignar la imagen actual como vista previa inicial
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

  // Método para alternar entre el modo edición y visualización
  toggleEditMode(): void {
    if (this.editMode) {
      // Si estamos en modo edición, guardamos los cambios
      this.saveProfile();
    } else {
      // Cambiar a modo edición
      this.editMode = !this.editMode;
    }
  }

  // Método para activar el input file cuando se hace clic en el botón estilizado
  triggerFileInput(): void {
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Método para manejar la selección de una nueva imagen
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Actualizar la vista previa con la nueva imagen
        this.userData.photo = e.target.result; // Asignar la imagen al userData
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para enviar los cambios del perfil
  saveProfile(): void {
    if (this.userData.id) {
      console.log('Saving profile for id:', this.userData.id); // Usar el id en lugar de userId para actualizar
      this.profileService.updateUserProfile(this.userData.id, this.userData).subscribe(
        (response) => {
          console.log('Perfil actualizado exitosamente', response);
          this.editMode = false; // Salir del modo edición
        },
        (error) => {
          console.log('Perfil actualizado exitosamente');
          this.editMode = false; // Salir del modo edición
        }
      );
    } else {
      console.error('No se encontró el id al guardar el perfil');
    }
  }

}
