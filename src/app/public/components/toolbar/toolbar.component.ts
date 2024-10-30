import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../register/service/auth.service';
import { Router } from '@angular/router';
import {ProfileService} from "../../../profiles/services/profile.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  userRole: string = '';
  userPhoto: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';

    const userId = +localStorage.getItem('id')!;
    if (userId) {
      this.profileService.getProfileByUserId(userId).subscribe(
        (profile) => {
          if (profile && profile.length > 0) {
            this.userPhoto = profile[0].photo;
          } else if (profile && profile.userId === userId) {
            this.userPhoto = profile.photo;
          }
        },
        (error) => {
          console.error('Error al obtener el perfil del usuario:', error);
        }
      );
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset;
    this.isScrolled = offset > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      if (this.isMenuOpen) {
        navLinks.classList.add('active');
      } else {
        navLinks.classList.remove('active');
      }
    }
  }
}
