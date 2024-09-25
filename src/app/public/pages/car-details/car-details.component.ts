import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CarService} from "../../../cars/services/car.service";

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  car: any;
  userRole: string = '';

  constructor(private route: ActivatedRoute, private carService: CarService) {} // Inyecta el servicio

  ngOnInit() {
    const carId = +this.route.snapshot.paramMap.get('id')!;
    this.car = this.carService.getCarById(carId);
    this.userRole = localStorage.getItem('userRole') || '';
  }
}
