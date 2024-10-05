import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service'; // Asegúrate de que la ruta es correcta

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Comprobar si hay un token al iniciar la aplicación
    const token = localStorage.getItem('access_token');
    if (token) {
      this.loggedInSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.login(email, password).pipe(
      tap((response) => {
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.loggedInSubject.next(true); // Cambia el estado de autenticación
        }
      })
    );
  }

  logout() {
    console.log('Logout called');
    localStorage.removeItem('access_token'); // Asegúrate de limpiar correctamente
    this.loggedInSubject.next(false);
  }

  isLoggedIn() {
    return this.loggedInSubject.value; // Devuelve el estado actual
  }
}
