import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  spaces = [
    { name: 'Sala de Reuniones A', capacity: 10, type: 'meeting_room', available_from: '2024-10-04', available_until: '2024-10-10' },
    { name: 'Oficina Privada', capacity: 5, type: 'office', available_from: '2024-10-05', available_until: '2024-10-11' },
    { name: 'Coworking Area', capacity: 20, type: 'coworking', available_from: '2024-10-06', available_until: '2024-10-12' }
  ];

  filteredSpaces = this.spaces;

  filterSpaces(type: string, capacity: number, date: string) {
    this.filteredSpaces = this.spaces.filter(space => {
      return (!type || space.type === type) &&
             (!capacity || space.capacity >= capacity) &&
             (!date || (space.available_from <= date && space.available_until >= date));
    });
  }

  onFilterSubmit() {
    const type = (document.getElementById('spaceType') as HTMLSelectElement).value;
    const capacity = parseInt((document.getElementById('capacity') as HTMLSelectElement).value, 10);
    const date = (document.getElementById('startDate') as HTMLInputElement).value;
    this.filterSpaces(type, capacity, date);
  }
}
