import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  startDate: string;
  endDate: string;
  description: string;
  unavailableTimes: string[];
  reservations: Reservation[];
  photo: string;
}

interface Reservation {
  id: number;
  space_id: number;
  start_time: string; // Horario de inicio
  end_time: string; // Horario de fin
}

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  filteredSpaces: Space[] = [];
  selectedSpaceType: string = '';
  selectedCapacity: number | null = null;
  selectedStartDate: string = '';
  selectedSpace: Space = {
    id: 0,
    name: '',
    type: '',
    capacity: 0,
    startDate: '',
    endDate: '',
    description: '',
    unavailableTimes: [],
    reservations: [],
    photo: '',
  };
  user: User | null = null;
  isEditing: boolean = false; // Controla la visibilidad del modal de edición
  isModalOpen: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getSpaces();
    this.getUser();
  }

  getUser(): void {
    this.apiService.getUser().subscribe({
      next: (user) => {
        this.user = user;
      }
    });
  }

  getSpaces(): void {
    this.apiService.getItems().subscribe({
      next: (spaces) => {
        this.filteredSpaces = spaces;
      },
      error: (error) => {
        console.error('Error al obtener los espacios:', error);
      }
    });
  } 

  // Filtrado de espacios
// Filtrado de espacios
  onFilterSubmit(event: Event): void {
    event.preventDefault();

    // Comprobar que filteredSpaces tenga datos iniciales
    if (!this.filteredSpaces || this.filteredSpaces.length === 0) {
      return; // No hay espacios para filtrar
    }

    this.filteredSpaces = this.filteredSpaces.filter((space: Space) => {

      const isTypeMatch = space.type === this.selectedSpaceType || !this.selectedSpaceType;

      const isCapacityMatch = this.selectedCapacity === null || space.capacity >= this.selectedCapacity;

      const spaceStartDate = new Date(space.startDate);
      const selectedStartDate = new Date(this.selectedStartDate);

      const isDateMatch = !this.selectedStartDate || spaceStartDate >= selectedStartDate;

      return isTypeMatch && isCapacityMatch && isDateMatch;
    });
  }

 
  // Obtener horarios ocupados
  getOccupiedTimes(space: Space): string[] {
    const occupiedTimes: { [date: string]: { start: string; end: string }[] } = {};

    space.reservations.forEach(reservation => {
      const startDate = new Date(reservation.start_time);
      const endDate = new Date(reservation.end_time);

      // Formatear la fecha
      const dateString = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
      
      // Formatear las horas
      const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      // Agrupar por fecha
      if (!occupiedTimes[dateString]) {
        occupiedTimes[dateString] = [];
      }
      occupiedTimes[dateString].push({ start: startTime, end: endTime });
    });

    // Crear un array con el formato deseado
    const formattedOccupiedTimes: string[] = [];
    for (const date in occupiedTimes) {
      const timeRanges = occupiedTimes[date];
      
      // Comprobar si hay más de un rango de tiempo
      if (timeRanges.length > 1) {
        // Concatenar los rangos de tiempo
        const startRange = timeRanges[0].start; // primer rango
        const endRange = timeRanges[timeRanges.length - 1].end; // último rango
        formattedOccupiedTimes.push(`${date}, ${startRange} - ${endRange}`);
      } else {
        // Solo un rango de tiempo
        formattedOccupiedTimes.push(`${date}, ${timeRanges[0].start} - ${timeRanges[0].end}`);
      }
    }

    return formattedOccupiedTimes;
  }


  // Calcular horarios disponibles
  getAvailableTimes(space: Space): string[] {
    const allTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    
    // Obtener horarios ocupados
    const occupiedTimes = this.getOccupiedTimes(space);
    
    // Crear un array de horarios ocupados sin duplicados
    const unavailableTimes = [...new Set(occupiedTimes)];

    // Filtrar los horarios disponibles
    const availableTimes = allTimes.filter(time => !unavailableTimes.includes(time));

    return availableTimes;
  }


  openModal(space: Space): void {
    this.selectedSpace = space;
    this.isModalOpen = true;

    const availableTimes = this.getAvailableTimes(space);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSpace = {
      id: 0,
      name: '',
      type: '',
      capacity: 0,
      startDate: '',
      endDate: '',
      description: '',
      unavailableTimes: [],
      reservations: [],
      photo: '',
    };
  }


  
  selectSpace(space: Space): void {
    this.selectedSpace = space;
  }
  

  
  editSpace(space: any) {
    this.selectedSpace = { ...space };
    this.isEditing = true;
  }

  // Método para cerrar el modal de edición
  closeEditModal() {
    this.isEditing = false; // Ocultar el modal de edición
  }



  // Funciones para editar y eliminar espacios

  updateSpace(space: Space) {
    this.apiService.editSpace(space.id, space).subscribe({
      next: () => {
        this.closeEditModal(); // Cerrar el modal después de guardar
        this.getSpaces(); // Opcionalmente, volver a obtener la lista de espacios
      },
      error: (error) => {
        console.error('Error al editar el espacio:', error);
      }
    });
  }

  deleteSpace(space: any) {
    this.apiService.deleteSpace(space.id).subscribe({
      next: () => {
        this.getSpaces();
      },
      error: (error) => {
        console.error('Error al eliminar el espacio:', error);
      }
    });
  }

}