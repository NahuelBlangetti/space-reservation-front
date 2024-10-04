import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})


export class HomeComponent implements OnInit {
  filteredSpaces: Space[] = [];
  selectedSpaceType: string = ''; // Almacena el tipo de espacio seleccionado
  selectedCapacity: number | null = null ; // Almacena la capacidad seleccionada
  selectedStartDate: string = ''; // Almacena la fecha seleccionada

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getSpaces();
  }

  getSpaces(): void {
    this.apiService.getItems().subscribe({
      next: (spaces) => {
        console.log('Espacios obtenidos:', spaces);
        this.filteredSpaces = spaces;
      },
      error: (error) => {
        console.error('Error al obtener los espacios:', error);
      }
    });
  } 

  // Filtrado de espacios
  onFilterSubmit(event: Event): void {
    event.preventDefault();

    // Comprobar que filteredSpaces tenga datos iniciales
    if (!this.filteredSpaces || this.filteredSpaces.length === 0) {
      return; // No hay espacios para filtrar
    }

    this.filteredSpaces = this.filteredSpaces.filter((space: Space) => {
      const isTypeMatch = space.type === this.selectedSpaceType || !this.selectedSpaceType;

      // Comprueba si selectedCapacity es vacío o null y actualiza la comparación
      const isCapacityMatch = (this.selectedCapacity === null) || (space.capacity <= this.selectedCapacity);

      // Filtrado por fecha, si está seleccionada
      const isDateMatch = !this.selectedStartDate || new Date(space.startDate) >= new Date(this.selectedStartDate);

      return isTypeMatch && isCapacityMatch && isDateMatch;
    });
  }

}

interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  startDate: string;
  endDate: string;
}