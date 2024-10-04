import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}
    /* Auth */
    register(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/register`, data);
    }
    login(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, data);
    }



    
    getItems(): Observable<any> {
      return this.http.get(`${this.apiUrl}/spaces`);
    }
  
    
    addItem(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/spaces`, data);
    }
}