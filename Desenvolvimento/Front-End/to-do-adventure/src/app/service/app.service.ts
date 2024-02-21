import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private urlJourney = 'http://127.0.0.1:5000/journeys';

  constructor(private http: HttpClient) { }

  getJourneys(): Observable<any> {
    return this.http.get<any>(this.urlJourney);
  }
  
  createJourney(data: any): Observable<any> {
    return this.http.post(this.urlJourney, data);
  }

  updateJourney(journeyId: number, data: any): Observable<any> {
    const url = `${this.urlJourney}/${journeyId}`;
    return this.http.put(url, data);
  }

  deleteJourney(journeyId: number): Observable<any> {
    const url = `${this.urlJourney}/${journeyId}`;
    return this.http.delete(url);
  }

  createMission(journeyId: number, data: any): Observable<any> {
    const url = `${this.urlJourney}/${journeyId}/missions`;
    return this.http.post(url, data);
  }

  updateMission(journeyId: number, missionId: number, data: any): Observable<any> {
    const url = `${this.urlJourney}/${journeyId}/missions/${missionId}`;
    return this.http.put(url, data);
  }

  deleteMission(journeyId: number, missionId: number): Observable<any> {
    const url = `${this.urlJourney}/${journeyId}/missions/${missionId}`;
    return this.http.delete(url);
  }

  getSettedJourney(): Observable<any> {
    const url = 'http://127.0.0.1:5000/setted_journey';
    return this.http.get<any>(url);
  }

  setSettedJourney(journeyId: number): Observable<any> {
    const url = `http://127.0.0.1:5000/setted_journey/${journeyId}`;
    return this.http.put(url, {});
  }
}
