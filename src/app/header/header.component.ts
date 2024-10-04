import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router'; // Importa el Router
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega RouterModule aquí
  templateUrl: './header.component.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./header.component.css'] // Asegúrate de que la ruta sea correcta
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Suscríbete al estado de autenticación
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout(event: MouseEvent) {
    event.stopPropagation(); // Evita que el evento se propague
    this.authService.logout(); // Llama a tu método de logout
    this.router.navigate(['/']); // Navega a la ruta deseada
  }
}
