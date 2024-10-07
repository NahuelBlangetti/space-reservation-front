import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

interface Space {
  id: number;
  capacity: number;
  created_at: string;
  description: string;
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

interface Reserva {
  id: number; // Permitir que 'id' sea null
  user_id: number;
  space_id: number;
  evento: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
  space: Space | null;
}

@Component({
  selector: 'app-myspaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers:[MessageService],
  templateUrl: './myspaces.component.html',
  styleUrl: './myspaces.component.css'
})

export class MyspacesComponent {

  loading: boolean = false;
  reservas: Reserva[] = [];
  spaces: Space[] = [];
  mostrarModal: boolean = false;
 
  nuevaReserva: Reserva = {
    id: 0,
    user_id: 0,
    space_id: 0,
    evento: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    start_time: '',
    end_time: '',
    created_at: new Date(),
    updated_at: new Date(),
    space: null
  };
  

  constructor(private apiService: ApiService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getSpaces();
    this.getReservations();
  }

  getSpaces(): void {
    this.apiService.getItems().subscribe({
      next: (spaces) => {
        this.spaces = spaces;
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al obtener los espacios:'});
      }
    });
  }

  getReservations(): void {
    this.apiService.getReservations().subscribe({
      next: (response) => {
        if (response.success) {
          this.reservas = response.reservations;
        }
      },
      error: (error) => {
        console.error('Error al obtener las reservas:', error);
      }
    });
  }


  guardarReserva() {
    const start_time = `${this.nuevaReserva.fecha}T${this.nuevaReserva.horaInicio}`;
    const end_time = `${this.nuevaReserva.fecha}T${this.nuevaReserva.horaFin}`;
  
    // Comprobar que end_time sea posterior a start_time
    if (new Date(end_time) <= new Date(start_time)) {
      alert('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }
  
    const existeReservaConflicto = this.reservas.some((reserva) => {
      return reserva.start_time === start_time && (
        (start_time >= reserva.start_time && start_time < reserva.end_time) ||
        (end_time > reserva.start_time && end_time <= reserva.end_time)
      );
    });
  
    if (existeReservaConflicto) {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva creada exitosamente.'});
    } else if (this.nuevaReserva.id) { // Si se está editando
      // Lógica de actualización
      this.apiService.updateReservation(this.nuevaReserva.id, {
        user_id: this.nuevaReserva.user_id,
        space_id: this.nuevaReserva.space_id,
        start_time,
        end_time
      }).subscribe({
        next: (response) => {
          alert(response.message);
          const index = this.reservas.findIndex(r => r.id === this.nuevaReserva.id);
          if (index !== -1) {
            this.reservas[index] = {
              ...this.nuevaReserva,
              start_time,
              end_time,
              updated_at: new Date() // Mantener actualizado el timestamp
            };
          }
          this.resetForm(); // Resetea el formulario después de guardar
          this.getReservations(); // Actualiza la lista de reservas
          this.cerrarModal(); // Cierra el modal
        },
        error: (err) => {
          console.error(err);
          const message = err?.error?.message || 'Ha ocurrido un error';
          
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error'});
        },
      });
    } else {
      // Lógica para crear una nueva reserva
      this.apiService.addReservation({
        user_id: this.nuevaReserva.user_id,
        space_id: this.nuevaReserva.space_id,
        start_time,
        end_time
      }).subscribe({
        next: (response) => {
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva creada exitosamente.'});
          this.reservas.push({ 
            ...this.nuevaReserva, 
            start_time, 
            end_time,
            created_at: new Date(),
            updated_at: new Date(),
            id: response.id // Asumiendo que la API devuelve el ID de la nueva reserva
          });
          this.resetForm();
          this.getReservations();
          this.cerrarModal();
        },
        error: (err) => {
          console.error(err);
          const message = err?.error?.message || 'Ha ocurrido un error';
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ha ocurrido un error'});
        }
      });
    }
  }
  
  resetForm() {
    this.nuevaReserva = {
      user_id: 0,
      space_id: 0,
      evento: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      start_time: '',
      end_time: '',
      created_at: new Date(),
      updated_at: new Date(),
      id: 0,
      space: null
    };
  }


  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }


  editarReserva(reserva: Reserva) {
    this.nuevaReserva = {
      user_id: reserva.user_id,
      space_id: reserva.space_id,
      evento: reserva.evento,
      fecha: reserva.fecha,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      start_time: reserva.start_time,
      end_time: reserva.end_time,
      created_at: reserva.created_at,
      updated_at: reserva.updated_at,
      id: reserva.id || 0,
      space: reserva.space
    };
    this.abrirModal();

  }
  

  cancelarReserva(reserva: Reserva) {
    this.apiService.deleteReservation(reserva.id).subscribe({
      next: () => {
        this.reservas = this.reservas.filter(r => r.id !== reserva.id);
        alert('Reserva cancelada exitosamente.');
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva cancelada exitosamente.'});
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al cancelar la reserva:'});
      }
    });
  }


  showError() {
    
  }


}
