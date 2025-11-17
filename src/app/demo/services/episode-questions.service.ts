import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface EpisodeQuestion {
  id?: string;
  episodeId: string;
  questionId: number;
  seasonId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkAssignRequest {
  seasonId: string;
  questionIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EpisodeQuestionsService {

  constructor(private http: HttpClient) { }

  // Assign single question to episode
  assignQuestionToEpisode(data: EpisodeQuestion): Observable<any> {
    return this.http.post<any>(`${environment.URL}/episode-questions`, data);
  }

  // Bulk assign questions to episode
  bulkAssignQuestionsToEpisode(episodeId: string, data: BulkAssignRequest): Observable<any> {
    return this.http.post<any>(`${environment.URL}/episode-questions/episode/${episodeId}/assign`, data);
  }

  // Get questions by episode
  getQuestionsByEpisode(episodeId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/episode-questions/episode/${episodeId}`);
  }

  // Remove question from episode
  removeQuestionFromEpisode(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/episode-questions/${id}`);
  }
}

