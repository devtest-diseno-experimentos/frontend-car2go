import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../../register/service/auth.service";
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})

export class ProfileFormComponent implements OnInit {
  @Output() formClosed = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<any>();

  profileForm: FormGroup;
  selectedFile: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      names: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],
      photo: ['', Validators.required]  // Campo para almacenar la imagen en Base64
    });
  }

  ngOnInit(): void {
    // Obtener el userId desde localStorage (tras el inicio de sesión)
    const userId = +localStorage.getItem('id')!;

    if (userId) {
      // Llamar al AuthService para obtener los detalles del usuario por su userId
      this.authService.getUserById(userId).subscribe(
        (user) => {
          if (user) {
            this.userId = user.id;  // Guardar el userId

            // Rellenar el formulario con los datos del usuario obtenidos de la API
            this.profileForm.patchValue({
              names: user.name,
              email: user.email,
              lastName: user.lastName,
              dni: user.dni,
              address: user.address,
              phoneNumber: user.phoneNumber
            });

            // Deshabilitar los campos "names" y "email" para que no se puedan editar
            this.profileForm.get('names')?.disable();
            this.profileForm.get('email')?.disable();

            // Mostrar la foto de perfil si existe
            if (user.photoUrl) {
              this.photoPreview = user.photoUrl;
            }
          } else {
            console.error('No se encontró el usuario con ese ID');
          }
        },
        (error) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      );
    } else {
      console.error('No se encontró el ID del usuario en el localStorage.');
    }
  }

  // Manejar la selección de archivos y convertir a Base64
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
        this.profileForm.patchValue({ photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // Enviar los datos del formulario
  onSubmit(): void {
    if (this.profileForm.valid && this.userId) {
      // Habilitar temporalmente los campos deshabilitados para incluirlos en el POST
      this.profileForm.get('names')?.enable();
      this.profileForm.get('email')?.enable();

      // Obtener los datos del formulario
      const profileData = this.profileForm.value;
      profileData.userId = this.userId;

      // Enviar los datos al servicio de perfil
      this.profileService.updateUserProfile(profileData).subscribe(
        (response) => {
          console.log('Perfil actualizado exitosamente', response);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error);
        }
      );
    }
  }

  closeForm() {
    this.formClosed.emit();
  }
}

