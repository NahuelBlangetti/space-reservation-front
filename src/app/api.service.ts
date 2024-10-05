import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8000/api';

  /* Auth */
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/spaces`);
  }


  addItem(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/spaces`, data);
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('access_token'); 

    // Incluimos el token en las cabeceras
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  getReservations(): Observable<any> {
    const token = localStorage.getItem('access_token'); 

    // Incluimos el token en las cabeceras
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/reservations`, { headers });
  }

  addReservation(data: any): Observable<any> {
    const token = localStorage.getItem('access_token'); 

    // Incluimos el token en las cabeceras
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/reservations`, data, { headers });
  }
  
  updateReservation(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('access_token'); 

    // Incluimos el token en las cabeceras
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/reservations/${id}`, data, { headers });
  }

  deleteReservation(id: number): Observable<any> {
    const token = localStorage.getItem('access_token'); 

    // Incluimos el token en las cabeceras
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/reservations/${id}`, { headers });
  }

  editSpace(id: number, data: any): Observable<any> {

    const token = localStorage.getItem('access_token'); 

    // Incluimos el token en las cabeceras
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