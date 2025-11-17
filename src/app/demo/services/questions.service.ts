import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface QuestionChoice {
  id?: string;
  choose: string;
  questionId?: string;
  isAnswer: boolean;
}

export interface Question {
  _id?: string;
  id?: string;
  episodeId?: string;
  categoryId?: string;
  question: string;
  type?: string; // 'multiple_choice', 'true_false', 'short_answer'
  rewardType?: string;
  point?: number;
  filepath?: string;
  fileType?: string; // 'text', 'image', 'video', 'audio'
  categoryName?: string;
  rewardTypeName?: string;
  rewardMeasurement?: string;
  choices?: QuestionChoice[];
  createdAt?: string;
  updatedAt?: string;

  // Legacy fields for backward compatibility
  questionText?: string;
  questionType?: string;
  options?: string[];
  correctAnswer?: string;
  points?: number;
  difficulty?: string;
  timeLimit?: number;
  explanation?: string;
  order?: number;
  isActive?: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QuestionsResponse {
  success: boolean;
  message: string;
  data: {
    data: Question[];
    pagination: Pagination;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  // Get all questions with pagination
  getAllQuestions(page: number = 1, limit: number = 10): Observable<QuestionsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<QuestionsResponse>(`${environment.URL}/questions`, { params });
  }

  // Get questions by episode
  getQuestionsByEpisode(episodeId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/questions/episode/${episodeId}`);
  }

  // Get questions by category with pagination
  getQuestionsByCategory(categoryId: string, page: number = 1, limit: number = 10): Observable<QuestionsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<QuestionsResponse>(`${environment.URL}/questions/category/${categoryId}`, { params });
  }

  // Get question by ID
  getQuestionById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/questions/${id}`);
  }

  // Create new question with file upload
  createQuestion(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.URL}/questions`, formData);
  }

  // Update question with file upload
  updateQuestion(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${environment.URL}/questions/${id}`, formData);
  }

  // Delete question
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/questions/${id}`);
  }
}

