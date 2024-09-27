import {Component, HostListener, OnInit} from '@angular/core';
import { AuthService } from '../../../register/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {

    this.userRole = localStorage.getItem('userRole') || '';
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
