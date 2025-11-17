import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TeamMember {
  id?: string;
  teamId?: string;
  competitorId?: string;
  createdAt?: string;
  updatetime?: string;
  competitorName?: string;
  competitorCode?: string;
}

export interface Team {
  _id?: string;
  id?: string;
  name: string;
  seasonId?: number | null;
  description?: string;
  color: string;
  members?: TeamMember[];
  competitorIds?: number[];
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

  // Add competitor to team
  addCompetitorToTeam(teamId: string, competitorId: number): Observable<any> {
    return this.http.post<any>(`${environment.URL}/teams/${teamId}/competitors`, { competitorId });
  }

  // Remove competitor from team
  removeCompetitorFromTeam(teamId: string, competitorId: number): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/teams/${teamId}/competitors/${competitorId}`);
  }
}

