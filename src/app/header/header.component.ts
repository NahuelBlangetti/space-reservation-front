import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router'; // Importa el Router
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.component.html', 
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userName: any;

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnInit(): void {
    this.apiService.getUserObservable().subscribe(user => {
      if (user) {
        this.userName = user.name; // Asigna el nombre del usuario a la variable  
        localStorage.setItem('user_name', user.name);
      } else {
        this.userName = localStorage.getItem('user_name');
      }
    });
  }
  
   

  logout(event: MouseEvent) {
    event.stopPropagation();
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      location.reload();
    });
  }
}
