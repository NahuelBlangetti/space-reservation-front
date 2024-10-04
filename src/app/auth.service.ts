import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // Asegúrate de importar ApiService
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private apiService: ApiService) {}

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
    localStorage.removeItem('authToken'); // Asegúrate de limpiar correctamente
    this.loggedInSubject.next(false);
  }

  isLoggedIn() {
    return this.loggedInSubject.value; // Devuelve el estado actual
  }
}
