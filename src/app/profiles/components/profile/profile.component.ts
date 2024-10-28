import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { CarService } from '../../../cars/services/car.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = {}; // Aquí se almacenarán los datos del perfil
  userId: number | null = null; // ID del usuario logueado
  userVehicles: any[] = []; // Aquí se almacenarán los vehículos del usuario

  constructor(private profileService: ProfileService, private carService: CarService) {}

  ngOnInit(): void {
    // Obtener el ID del usuario logueado desde localStorage
    this.userId = +localStorage.getItem('id')!;

    if (this.userId) {
      // Llamar al servicio para obtener el perfil asociado al userId
      this.profileService.getProfileByUserId(this.userId).subscribe(
        (profile) => {
          console.log('Respuesta de la API:', profile); // Verificar qué está devolviendo la API

          // Si la API devuelve un array, verificamos si el perfil existe
          if (profile && profile.length > 0) {
            this.userData = profile[0];  // Asignar el primer perfil al userData
          } else if (profile && profile.userId === this.userId) {
            this.userData = profile; // Asignar los datos si es un objeto único
          } else {
            console.error('No se encontró el perfil para el userId:', this.userId);
          }
        }
      );

      this.carService.getCarsByUserId(this.userId).subscribe(
        (vehicles) => {
          this.userVehicles = vehicles;
        },
        (error) => {
          console.error('Error al obtener los vehículos del usuario:', error);
        }
      );
    } else {
      console.error('No se encontró el ID del usuario en el localStorage.');
    }
  }

  // Método para redirigir a la edición del perfil
  editProfile(): void {
    console.log('Editar perfil');
  }

}
