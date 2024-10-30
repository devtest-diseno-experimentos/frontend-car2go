import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService} from "../../services/authentication.service";
import { SignInRequest } from "../../model/sign-in.request";
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm!: FormGroup;
  hide: boolean = true;  // Controlar visibilidad de la contraseña
  isSignedIn: boolean = false;
  httpOptions: any;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.isSignedIn.subscribe((isSignedIn) => {
      this.isSignedIn = isSignedIn;
    });
  }

  ngOnInit(): void {
    // Configurar encabezados de autenticación
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      })
    };

    // Inicializar el formulario de inicio de sesión
    this.signInForm = this.builder.group({
      username: ['', [Validators.required]],  // Se valida que sea un email
      password: ['', Validators.required],
    });
  }

  // Manejar el inicio de sesión
  onSignInSubmit() {
    if (this.signInForm.invalid) return;

    const signInRequest: SignInRequest = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password
    };

    this.authenticationService.signIn(signInRequest).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error during sign-in:', error);
      }
    });
  }

  // Alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  // Cerrar sesión del usuario
  onSignOut() {
    this.authenticationService.signOut();
  }
}
