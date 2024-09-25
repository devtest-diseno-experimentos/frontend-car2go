import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {CarService} from "../../../cars/services/car.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole: string = '';
  showForm: boolean = false;
  cars: any[] = [];

  constructor(private router: Router, private carService: CarService) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';
    this.cars = this.carService.getCars();
  }

  openModal() {
    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
  }


  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }

  onFormClosed() {
    this.showForm = false;
  }
}
