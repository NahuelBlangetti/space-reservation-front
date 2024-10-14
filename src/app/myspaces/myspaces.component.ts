import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';


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
  imports: [CommonModule, FormsModule, ToastModule, FullCalendarModule],
  templateUrl: './myspaces.component.html',
  styleUrl: './myspaces.component.css'
})

export class MyspacesComponent {

  loading: boolean = false;
  reservas: Reserva[] = [];
  allReservas: Reserva[] = [];
  spaces: Space[] = [];
  mostrarModal: boolean = false;
  calendarOptions: any;
 
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
  

  constructor(private apiService: ApiService, private messageService: MessageService) { 
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      eventTimeFormat: { // Formato para mostrar la hora
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Usar formato de 24 horas
      },
      eventDisplay: 'block', // Mostrar eventos en bloque para mejor visibilidad
    };
   }

  ngOnInit(): void {
    this.getSpaces();
    this.getReservations();
    this.allReservations();
  }

  getSpaces(): void {
    this.apiService.getItems().subscribe({
      next: (spaces) => {
        this.spaces = spaces;
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al obtener los espacios:', life: 1500, closable: false});
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
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al obtener las reservas:', life: 1500, closable: false});
      }
    });
  }

  allReservations(): void {
    this.apiService.allReservations().subscribe({
      next: (response) => {
        if (response.success) {
          this.allReservas = response.reservations;
          this.calendarOptions.events = this.allReservas.map((reserva) => {
            return {
              title: reserva.space?.name,
              start: reserva.start_time,
              end: reserva.end_time,
              color: reserva.space?.type === 'Sala de reuniones' ? 'blue' : 'green', // Color por tipo de espacio
              textColor: 'white', // Color del texto para mejorar contraste
              borderColor: reserva.space?.type === 'Sala de reuniones' ? 'darkblue' : 'darkgreen', // Borde para mejor visibilidad
            };
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener las reservas:', error);
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al obtener las reservas:', life: 1500, closable: false});
      }
    });
  }

  guardarReserva() {
    const start_time = `${this.nuevaReserva.fecha}T${this.nuevaReserva.horaInicio}`;
    const end_time = `${this.nuevaReserva.fecha}T${this.nuevaReserva.horaFin}`;
  
    if (new Date(end_time) <= new Date(start_time)) {
      this.messageService.add({severity:'info', summary: 'Atento', detail: 'La hora de finalización debe ser posterior a la hora de inicio.', life: 1500, closable: false});

      return;
    }
  
    const existeReservaConflicto = this.reservas.some((reserva) => {
      return reserva.start_time === start_time && (
        (start_time >= reserva.start_time && start_time < reserva.end_time) ||
        (end_time > reserva.start_time && end_time <= reserva.end_time)
      );
    });
  
    if (existeReservaConflicto) {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva creada exitosamente.',life: 1500, closable: false});
    } else if (this.nuevaReserva.id) { 
  
      this.apiService.updateReservation(this.nuevaReserva.id, {
        user_id: this.nuevaReserva.user_id,
        space_id: this.nuevaReserva.space_id,
        start_time,
        end_time
      }).subscribe({
        next: (response) => {
          const index = this.reservas.findIndex(r => r.id === this.nuevaReserva.id);
          if (index !== -1) {
            this.reservas[index] = {
              ...this.nuevaReserva,
              start_time,
              end_time,
              updated_at: new Date() 
            };
          }
          this.resetForm(); 
          this.getReservations();
          this.allReservations();
          this.cerrarModal();
          
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva editada exitosamente.', life: 1500, closable: false});
        },
        error: (err) => {
          if (err.status == 409) {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'La reserva se superpone con otra existente', life: 1500, closable: false});
          } 
        },
      });
    } else {
      this.apiService.addReservation({
        user_id: this.nuevaReserva.user_id,
        space_id: this.nuevaReserva.space_id,
        start_time,
        end_time
      }).subscribe({
        next: (response) => {
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva creada exitosamente.', life: 1500, closable: false});
          this.reservas.push({ 
            ...this.nuevaReserva, 
            start_time, 
            end_time,
            created_at: new Date(),
            updated_at: new Date(),
            id: response.id 
          });
          this.resetForm();
          this.getReservations();
          this.allReservations();
          this.cerrarModal();
        },
        error: (err) => {

          if (err.status == 409) {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'La reserva se superpone con otra existente', life: 1500, closable: false});
          }          
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
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Reserva cancelada exitosamente.', life: 1500, closable: false});
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al cancelar la reserva:', life: 1500, closable: false});
      }
    });
  }

}
