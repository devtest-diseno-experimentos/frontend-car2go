import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../register/service/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = +localStorage.getItem('id')!;
    this.authService.getUserInfo(userId).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener la información del usuario:', error);
      }
    );
  }
}
