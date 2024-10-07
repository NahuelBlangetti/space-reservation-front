import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';



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
  start_time: string; 
  end_time: string;
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
  selectedStartTime: string = '';
  allSpaces: Space[] = [];
  newSpace: Space = {
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
  isEditing: boolean = false;
  isModalOpen: boolean = false;
  isCreateModalOpen: boolean = false;




  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getSpaces();
    this.getUser();
    this.loadSpaces(); 
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
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al obtener los espacios:', life: 1500, closable: false});
      }
    });
  } 

  loadSpaces() {

    this.apiService.getItems().subscribe(spaces => {
      this.allSpaces = spaces; 
      this.filteredSpaces = [...this.allSpaces]; 
    });
  }


  onFilterSubmit(event: Event): void {
    event.preventDefault();

    this.filteredSpaces = [...this.allSpaces];

    this.filteredSpaces = this.filteredSpaces.filter((space: Space) => {
     
        const isTypeMatch = space.type === this.selectedSpaceType || !this.selectedSpaceType;

        console.log(space.capacity, Number(this.selectedCapacity));

        const isCapacityMatch = this.selectedCapacity ? space.capacity == Number(this.selectedCapacity) : true;

        const isDateMatch = this.selectedStartDate
          ? !space.reservations || !space.reservations.some(reservation => {

              const reservationDate = new Date(reservation.start_time).toISOString().split('T')[0]; 
              console.log(reservationDate, this.selectedStartDate);
              return reservationDate === this.selectedStartDate;
            })
          : true;
    
        return isTypeMatch && isCapacityMatch && isDateMatch;
    });
  } 

  

 
  getOccupiedTimes(space: Space): string[] {
    const occupiedTimes: { [date: string]: { start: string; end: string }[] } = {};

    space.reservations.forEach(reservation => {
      const startDate = new Date(reservation.start_time);
      const endDate = new Date(reservation.end_time);


      const dateString = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
      

      const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      if (!occupiedTimes[dateString]) {
        occupiedTimes[dateString] = [];
      }
      occupiedTimes[dateString].push({ start: startTime, end: endTime });
    });


    const formattedOccupiedTimes: string[] = [];
    for (const date in occupiedTimes) {
      const timeRanges = occupiedTimes[date];
      

      if (timeRanges.length > 1) {

        const startRange = timeRanges[0].start;
        const endRange = timeRanges[timeRanges.length - 1].end; 
        formattedOccupiedTimes.push(`${date}, ${startRange} - ${endRange}`);
      } else {
        formattedOccupiedTimes.push(`${date}, ${timeRanges[0].start} - ${timeRanges[0].end}`);
      }
    }

    return formattedOccupiedTimes;
  }


  // Calcular horarios disponibles
  getAvailableTimes(space: Space): string[] {
    const allTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    
    const occupiedTimes = this.getOccupiedTimes(space);
    

    const unavailableTimes = [...new Set(occupiedTimes)];


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

  typeSpaces(type: string): string {
    if (type === 'meeting_room') {
      return 'Sala de reuniones';
    } else if (type === 'office') {
      return 'Oficina';
    } else if (type === 'coworking') {
      return 'Coworking';
    }
    return type;
  }

  closeEditModal() {
    this.isEditing = false;
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
  }
  
  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  // Funciones para crear, editar y eliminar espacios

  createSpace(space: Space) {
    this.apiService.createSpace(space).subscribe({
      next: () => {
        this.closeCreateModal();
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Espacio creado exitosamente.',life: 1500, closable: false});
        this.getSpaces();
        this.router.navigate(['/']).then(() => {
          location.reload();
        });
        this.newSpace = {id: 0, name: '', type: '', capacity: 0, startDate: '', endDate: '', description: '', unavailableTimes: [], reservations: [], photo: '' };
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al crear el espacio:', life: 1500, closable: false});

      }
    });
  }
  
  updateSpace(space: Space) {
    this.apiService.editSpace(space.id, space).subscribe({
      next: () => {
        this.closeEditModal(); 
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Espacio Actualizado', life: 1500, closable: false});
        this.getSpaces();
      },
      error: (error) => {
        console.error('Error al editar el espacio:', error);
      }
    });
  }

  deleteSpace(space: any) {
    this.apiService.deleteSpace(space.id).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Espacio Deshabilitado', life: 1500, closable: false});
        this.getSpaces();
      },
      error: (error) => {
        console.error('Error al eliminar el espacio:', error);
      }
    });
  }

}