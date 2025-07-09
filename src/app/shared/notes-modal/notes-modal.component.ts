import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrls: ['./notes-modal.component.css']
})
export class NotesModalComponent {
  @Input() notes: string = '';  // Recibe las notas completas
  @Input() reviewDate: string = '';  // Recibe la fecha de la revisión
  @Output() close = new EventEmitter<void>();  // Emitir cuando se cierra el modal

  closeModal() {
    this.close.emit();  // Cerrar el modal al hacer clic en la "X"
  }
}
