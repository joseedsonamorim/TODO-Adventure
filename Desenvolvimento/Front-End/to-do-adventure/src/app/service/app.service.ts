import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private apiUrl = 'http://127.0.0.1:5000/task';  // Substitua pela URL da sua API

  constructor(private http: HttpClient) { }

  getMissions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createTask(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateTask(id: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, data);
  }

  deleteTask(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
