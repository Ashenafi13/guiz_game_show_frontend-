import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Season {
  id?: string;
  name: string;
  description?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeasonsService {

  constructor(private http: HttpClient) { }

  // Get all seasons
  getAllSeasons(): Observable<any> {
    return this.http.get<any>(`${environment.URL}/seasons`);
  }

  // Get season by ID
  getSeasonById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/seasons/${id}`);
  }

  // Create new season
  createSeason(seasonData: Season): Observable<any> {
    return this.http.post<any>(`${environment.URL}/seasons`, seasonData);
  }

  // Update season
  updateSeason(id: string, seasonData: Season): Observable<any> {
    return this.http.put<any>(`${environment.URL}/seasons/${id}`, seasonData);
  }

  // Delete season
  deleteSeason(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/seasons/${id}`);
  }
}

