import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Team {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  color?: string;
  captain?: string;
  members?: string[];
  totalScore?: number;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private http: HttpClient) { }

  // Get all teams
  getAllTeams(): Observable<any> {
    return this.http.get<any>(`${environment.URL}/teams`);
  }

  // Get team by ID
  getTeamById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/teams/${id}`);
  }

  // Create new team
  createTeam(teamData: Team): Observable<any> {
    return this.http.post<any>(`${environment.URL}/teams`, teamData);
  }

  // Update team
  updateTeam(id: string, teamData: Team): Observable<any> {
    return this.http.put<any>(`${environment.URL}/teams/${id}`, teamData);
  }

  // Delete team
  deleteTeam(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/teams/${id}`);
  }
}

