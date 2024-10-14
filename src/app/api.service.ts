import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private apiUrl = 'http://localhost:8000/api';
  private userSubject = new BehaviorSubject<any>(null);


  /* Auth */
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Modificación de la función login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {

        this.loadUser(response.access_token);

        localStorage.setItem('access_token', response.access_token);
      }),
      catchError(error => {
        console.error('Error al iniciar sesión:', error);
        return throwError(error); // Manejo de errores
      })
    );
  }

  loadUser(Token?: string): void {
    const token = Token // Obtiene el token
    if (token) { // Solo llama si hay un token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get(`${this.apiUrl}/user`, { headers }).pipe(
        tap(user => {
          this.userSubject.next(user); // Actualiza el BehaviorSubject con la información del usuario
        }),
        catchError(error => {
          return throwError(error); // Manejo de errores
        })
      ).subscribe(); // Suscripción para ejecutar la llamada
    }
  }

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/spaces`);
  }


  addItem(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/spaces`, data);
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/user`, { headers }).pipe(
      tap((user) => this.userSubject.next(user))
    );
  }

  getUserObservable(): Observable<any> {
    return this.userSubject.asObservable(); // Devuelve el observable del BehaviorSubject
  }

  getReservations(): Observable<any> {
    const token = localStorage.getItem('access_token');


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/reservations`, { headers });
  }

  allReservations(): Observable<any> {
    const token = localStorage.getItem('access_token');


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/allReservations`, { headers });
  }

  addReservation(data: any): Observable<any> {
    const token = localStorage.getItem('access_token');


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/reservations`, data, { headers });
  }

  updateReservation(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('access_token');


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/reservations/${id}`, data, { headers });
  }

  deleteReservation(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/reservations/${id}`, { headers });
  }

  createSpace(data: any): Observable<any> {
    const token = localStorage.getItem('access_token');


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/spaces`, data, { headers });
  }


  editSpace(id: number, data: any): Observable<any> {

    const token = localStorage.getItem('access_token');


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/spaces/${id}`, data, { headers });
  }

  deleteSpace(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/spaces/available/${id}`, {}, { headers });
  }

} 