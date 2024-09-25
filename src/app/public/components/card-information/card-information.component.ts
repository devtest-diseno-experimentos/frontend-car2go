import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-card-information',
  templateUrl: './card-information.component.html',
  styleUrls: ['./card-information.component.css']
})
export class CardInformationComponent implements OnChanges {
  @Input() car: any;
  @Input() userRole: string = '';

  mainImage: string = '';
  images: string[] = [];

  ngOnChanges() {
    if (this.car) {
      this.mainImage = this.car.image;
      this.images = this.car.images || [this.car.image]; // Manejar múltiples imágenes
    }
  }

  changeImage(image: string) {
    this.mainImage = image;
  }
}
