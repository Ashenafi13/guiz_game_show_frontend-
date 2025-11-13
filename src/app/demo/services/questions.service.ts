import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Question {
  _id?: string;
  episodeId: string;
  categoryId?: string;
  questionText: string;
  questionType?: string; // 'multiple-choice', 'true-false', 'short-answer'
  options?: string[];
  correctAnswer: string;
  points?: number;
  difficulty?: string; // 'easy', 'medium', 'hard'
  timeLimit?: number; // in seconds
  explanation?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  // Get all questions
  getAllQuestions(): Observable<any> {
    return this.http.get<any>(`${environment.URL}/questions`);
  }

  // Get questions by episode
  getQuestionsByEpisode(episodeId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/questions/episode/${episodeId}`);
  }

  // Get questions by category
  getQuestionsByCategory(categoryId: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/questions/category/${categoryId}`);
  }

  // Get question by ID
  getQuestionById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/questions/${id}`);
  }

  // Create new question
  createQuestion(questionData: Question): Observable<any> {
    return this.http.post<any>(`${environment.URL}/questions`, questionData);
  }

  // Update question
  updateQuestion(id: string, questionData: Question): Observable<any> {
    return this.http.put<any>(`${environment.URL}/questions/${id}`, questionData);
  }

  // Delete question
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/questions/${id}`);
  }
}

