import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Contestant {
  id?: string;
  name: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContestantsService {

  constructor(private http: HttpClient) { }

  // Get all contestants
  getAllContestants(): Observable<any> {
    return this.http.get<any>(`${environment.URL}/competitors`);
  }

  // Get contestants by team
  getContestantsByTeam(teamId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/contestants/team/${teamId}`);
  }

  // Get contestant by ID
  getContestantById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/ccompetitors/${id}`);
  }

  // Create new contestant
  createContestant(contestantData: Contestant): Observable<any> {
    return this.http.post<any>(`${environment.URL}/competitors`, contestantData);
  }

  // Update contestant
  updateContestant(id: string, contestantData: Contestant): Observable<any> {
    return this.http.put<any>(`${environment.URL}/competitors/${id}`, contestantData);
  }

  // Delete contestant
  deleteContestant(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/competitors/${id}`);
  }
}

