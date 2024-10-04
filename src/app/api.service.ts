import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
} 