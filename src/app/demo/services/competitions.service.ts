import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CompetitionTeamMember {
  id: number | string;
  name: string;
  code: string;
}

export interface CompetitionTeam {
  id: number | string;
  name: string;
  color?: string;
  members?: CompetitionTeamMember[];
}

export interface Competition {
  id?: string;
  episodeId: string;
  seasonId: string;
  // Backend returns full team objects on GET, but we may send only team IDs on POST/PUT
  teams: (number | string | CompetitionTeam)[];
  name?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionsService {
  constructor(private http: HttpClient) {}

  getAllCompetitions(): Observable<any> {
    return this.http.get<any>(`${environment.URL}/competitions`);
  }

  getCompetitionById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/competitions/${id}`);
  }

  getCompetitionsByEpisode(episodeId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/competitions/episode/${episodeId}`);
  }

  getCompetitionsBySeason(seasonId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/competitions/season/${seasonId}`);
  }

  createCompetition(data: Competition): Observable<any> {
    return this.http.post<any>(`${environment.URL}/competitions`, data);
  }

  updateCompetition(id: string, data: Competition): Observable<any> {
    return this.http.put<any>(`${environment.URL}/competitions/${id}`, data);
  }

  deleteCompetition(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/competitions/${id}`);
  }
}

