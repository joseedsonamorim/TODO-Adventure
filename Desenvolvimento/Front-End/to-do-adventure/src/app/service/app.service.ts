import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private urlTask = 'http://127.0.0.1:5000/task';  // Substitua pela URL da sua API
  private urlJourney = 'http://127.0.0.1:5000/jornadas';  // Substitua pela URL da sua API

  constructor(private http: HttpClient) { }

  getMissions(): Observable<any> {
    return this.http.get<any>(this.urlTask);
  }

  createTask(data: any): Observable<any> {
    return this.http.post(this.urlTask, data);
  }

  updateTask(id?: number, data?: any): Observable<any> {
    const url = `${this.urlTask}/${id}`;
    return this.http.put(url, data);
  }

  deleteTask(id?: number): Observable<any> {
    const url = `${this.urlTask}/${id}`;
    return this.http.delete(url);
  }

  //Rotas jornada do héroi

  getJounerys(): Observable<any> {
    return this.http.get<any>(this.urlJourney);
  }

  getJourney(jorney?: string): Observable<any> {
    const url = `${this.urlJourney}/${jorney}`;
    return this.http.get<any>(url);
  }

  createJourney(data: any): Observable<any> {
    return this.http.post(this.urlJourney, data);
  }

  updateJourney(id?: number, data?: any): Observable<any> {
    const url = `${this.urlJourney}/${id}`;
    return this.http.put(url, data);
  }

  deleteJourney(id?: number): Observable<any> {
    const url = `${this.urlJourney}/${id}`;
    return this.http.delete(url);
  }
}
