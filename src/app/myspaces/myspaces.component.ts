import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Reserva {
  evento: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-myspaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myspaces.component.html',
  styleUrl: './myspaces.component.css'
})

export class MyspacesComponent {

  reservas: Reserva[] = [
    { evento: 'Evento Corporativo', fecha: '2024-10-15', horaInicio: '10:00', horaFin: '12:00' },
    // Agrega más reservas aquí
  ];

  mostrarModal: boolean = false;
  nuevaReserva: Reserva = { evento: '', fecha: '', horaInicio: '', horaFin: '' };

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarReserva() {
    // Lógica para validar que no haya reservas en horarios ocupados
    const existeReservaConflicto = this.reservas.some((reserva) => {
      return reserva.fecha === this.nuevaReserva.fecha && (
        (this.nuevaReserva.horaInicio >= reserva.horaInicio && this.nuevaReserva.horaInicio < reserva.horaFin) ||
        (this.nuevaReserva.horaFin > reserva.horaInicio && this.nuevaReserva.horaFin <= reserva.horaFin)
      );
    });

    if (existeReservaConflicto) {
      alert('Ya existe una reserva en ese horario.');
    } else {
      this.reservas.push({ ...this.nuevaReserva });
      this.nuevaReserva = { evento: '', fecha: '', horaInicio: '', horaFin: '' };
      this.cerrarModal();
    }
  }

  editarReserva(reserva: Reserva) {
    // Lógica para editar una reserva
    console.log('Editando reserva:', reserva);
  }

  cancelarReserva(reserva: Reserva) {
    // Lógica para cancelar una reserva
    this.reservas = this.reservas.filter(r => r !== reserva);
    console.log('Reserva cancelada:', reserva);
  }

}
