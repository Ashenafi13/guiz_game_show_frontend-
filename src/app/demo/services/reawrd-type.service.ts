import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface RewardType {
  id?: string;
  name: string;
  measurement: string;
}
@Injectable({
  providedIn: 'root'
})
export class RewardTypeService {

  constructor(private http: HttpClient) { }


    // Get all categories
    getAllRewardTypes(): Observable<any> {
      return this.http.get<any>(`${environment.URL}/reward-types`);
    }

    // Get category by ID
    getRewardTypeById(id: string): Observable<any> {
      return this.http.get<any>(`${environment.URL}/reward-types/${id}`);
    }

    // Create new category
    createRewardTypes(rewardTypeData: RewardType): Observable<any> {
      return this.http.post<any>(`${environment.URL}/reward-types`, rewardTypeData);
    }

    // Update category
    updateRewardTypes(id: string, rewardTypeData: RewardType): Observable<any> {
      return this.http.put<any>(`${environment.URL}/reward-types/${id}`, rewardTypeData);
    }

    // Delete category
    deleteRewardTypes(id: string): Observable<any> {
      return this.http.delete<any>(`${environment.URL}/reward-types/${id}`);
    }
}
