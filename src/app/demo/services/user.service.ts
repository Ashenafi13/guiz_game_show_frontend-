import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  status: number;
  message: string;
  success: boolean;
  data: UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Get user profile
  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${environment.URL}/user/profile`);
  }
}

