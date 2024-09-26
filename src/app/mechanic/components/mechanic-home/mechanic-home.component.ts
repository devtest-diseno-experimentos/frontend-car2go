import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-mechanic-home',
  templateUrl: './mechanic-home.component.html',
  styleUrls: ['./mechanic-home.component.css']
})
export class MechanicHomeComponent {
  constructor(private router: Router) { }
  // Aquí puedes manejar las acciones de la vista
  startInspection() {
    this.router.navigate(['/mechanic-check']);
  }
}
