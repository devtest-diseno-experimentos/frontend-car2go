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
  isNewProfile: boolean = false; // Indica si se debe crear un nuevo perfil

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      names: [{ value: '', disabled: true }, Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],
      photo: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    const userId = +localStorage.getItem('id')!;

    if (userId) {
      this.authService.getUserById(userId).subscribe(
        (user) => {
          if (user) {
            this.userId = user.id;

            this.profileForm.patchValue({
              names: user.name,
              email: user.email,
              lastName: user.lastName,
              dni: user.dni,
              address: user.address,
              phoneNumber: user.phoneNumber
            });

            this.profileForm.get('names')?.disable();
            this.profileForm.get('email')?.disable();

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

  onSubmit(): void {
    if (this.profileForm.valid && this.userId) {
      this.profileForm.get('names')?.enable();
      this.profileForm.get('email')?.enable();

      const profileData = this.profileForm.value;
      profileData.userId = this.userId;

       this.profileService.createUserProfile(profileData).subscribe(
          (response) => {
            console.log('Perfil creado exitosamente', response);
            this.router.navigate(['/home']);
          },
          (error) => {
            this.router.navigate(['/home']);
            console.error('Error al crear el perfil:', error);
          }
        );
      }

  }

  closeForm() {
    this.formClosed.emit();
  }
}
