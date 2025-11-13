import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Episode {
  _id?: string;
  seasonId: string;
  title: string;
  isActive?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {

  constructor(private http: HttpClient) { }

  // Get all episodes
  getAllEpisodes(): Observable<any> {
    return this.http.get<any>(`${environment.URL}/episodes`);
  }

  // Get episodes by season
  getEpisodesBySeason(seasonId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/episodes/season/${seasonId}`);
  }

  // Get episode by ID
  getEpisodeById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/episodes/${id}`);
  }

  // Create new episode
  createEpisode(episodeData: Episode): Observable<any> {
    return this.http.post<any>(`${environment.URL}/episodes`, episodeData);
  }

  // Update episode
  updateEpisode(id: string, episodeData: Episode): Observable<any> {
    return this.http.put<any>(`${environment.URL}/episodes/${id}`, episodeData);
  }

  // Delete episode
  deleteEpisode(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/episodes/${id}`);
  }
}

