import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-send-data',
  templateUrl: './send-data.component.html',
  styleUrl: './send-data.component.css'
})
export class SendDataComponent {
  constructor(private router: Router) { }

  redirectToPay() {
    this.router.navigate(['/pay']);
  }
}
