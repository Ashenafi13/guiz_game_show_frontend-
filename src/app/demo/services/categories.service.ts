import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Category {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  // Get all categories
  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${environment.URL}/categories`);
  }

  // Get category by ID
  getCategoryById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}/categories/${id}`);
  }

  // Create new category
  createCategory(categoryData: Category): Observable<any> {
    return this.http.post<any>(`${environment.URL}/categories`, categoryData);
  }

  // Update category
  updateCategory(id: string, categoryData: Category): Observable<any> {
    return this.http.put<any>(`${environment.URL}/categories/${id}`, categoryData);
  }

  // Delete category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}/categories/${id}`);
  }
}

