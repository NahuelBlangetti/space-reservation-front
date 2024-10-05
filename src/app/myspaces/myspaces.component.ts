import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';

interface Space {
  capacity: number;
  created_at: string;
  description: string;
  id: number;
  is_available: number;
  name: string;
  type: string;
  updated_at: string;
}

interface User {
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  name: string;
  updated_at: string;
}

export interface Reserva {
  id: number; // Agrega esta propiedad si no está presente
  user_id: number;
  space_id: number;
  evento: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  start_time: string; // Agregar si es necesario
  end_time: string;   // Agregar si es necesario
  created_at?: Date; // Si estás usando timestamps
  updated_at?: Date; // Si estás usando timestamps
  space?: any; // Si `space` es un objeto relacionado
}



@Component({
  selector: 'app-myspaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myspaces.component.html',
  styleUrl: './myspaces.component.css'
})

export class MyspacesComponent {

  loading: boolean = false;
  reservas: Reserva[] = [];
  mostrarModal: boolean = false;
  nuevaReserva: Reserva = {
    id: 0, // Inicializa con un valor adecuado o maneja la generación del ID
    user_id: 0,
    space_id: 0,
    evento: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    start_time: '', // Inicializa si es necesario
    end_time: '',   // Inicializa si es necesario
    created_at: new Date(), // Inicializa con la fecha actual si es necesario
    updated_at: new Date(), // Inicializa con la fecha actual si es necesario
  };
  
  

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getSpaces();
  }

  getSpaces(): void {
    this.apiService.getReservations().subscribe({
      next: (response) => {
        if (response.success) {
          this.reservas = response.reservations;
          console.log('Reservas obtenidas:', this.reservas);
        }
      },
      error: (error) => {
        console.error('Error al obtener las reservas:', error);
      }
    });
  }



  guardarReserva() {
    // Convertir fecha y horas en un formato adecuado para start_time y end_time
    const start_time = `${this.nuevaReserva.fecha}T${this.nuevaReserva.horaInicio}`;
    const end_time = `${this.nuevaReserva.fecha}T${this.nuevaReserva.horaFin}`;
    
    const existeReservaConflicto = this.reservas.some((reserva) => {
      return reserva.start_time === start_time && (
        (start_time >= reserva.start_time && start_time < reserva.end_time) ||
        (end_time > reserva.start_time && end_time <= reserva.end_time)
      );
    });

    if (existeReservaConflicto) {
      alert('Ya existe una reserva en ese horario.');
    } else {
      this.loading = true; // Activa el estado de carga

      // Llama al servicio para agregar la reserva
      this.apiService.addReservation({
        user_id: this.nuevaReserva.user_id,
        space_id: this.nuevaReserva.space_id,
        start_time: start_time,
        end_time: end_time
      }).subscribe({
        next: (response) => {
          alert(response.message); // Mensaje de éxito

          // Agrega la reserva a la lista local
          this.reservas.push({ 
            ...this.nuevaReserva, 
            start_time, 
            end_time,
            created_at: new Date(),
            updated_at: new Date(),
            id: this.reservas.length + 1 // Genera un ID simple
          });

          // Reiniciar el objeto nuevaReserva
          this.nuevaReserva = { 
            id: 0,
            user_id: 0,
            space_id: 0,
            evento: '',
            fecha: '',
            horaInicio: '',
            horaFin: '',
            start_time: '',
            end_time: '',
          };
 
          this.cerrarModal();
          this.loading = false; // Desactiva el estado de carga
        },
        error: (error) => {
          alert('Error al crear la reserva: ' + error.error.message); // Manejo de errores
          this.loading = false; // Desactiva el estado de carga en caso de error
        }
      });
    }
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
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
