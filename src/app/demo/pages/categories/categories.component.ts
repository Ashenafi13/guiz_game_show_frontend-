import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService, Category } from '../../services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading: boolean = false;
  error: string = '';

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  newCategory: Category = this.getEmptyCategory();
  editCategory: Category = this.getEmptyCategory();
  deleteCategoryId: string = '';
  deleteCategoryName: string = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  getEmptyCategory(): Category {
    return {
      name: '',
      description: '',
      icon: 'feather icon-tag',
      color: '#007bff',
      isActive: true
    };
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.newCategory = this.getEmptyCategory();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(category: Category): void {
    this.editCategory = { ...category };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openDeleteModal(category: Category): void {
    this.deleteCategoryId = category._id || '';
    this.deleteCategoryName = category.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  addCategory(): void {
    this.loading = true;
    this.error = '';
    this.categoriesService.createCategory(this.newCategory).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeAddModal();
        this.loadCategories();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create category';
        this.loading = false;
      }
    });
  }

  updateCategory(): void {
    if (!this.editCategory._id) return;
    this.loading = true;
    this.error = '';
    this.categoriesService.updateCategory(this.editCategory._id, this.editCategory).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeEditModal();
        this.loadCategories();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update category';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.deleteCategoryId) return;
    this.loading = true;
    this.error = '';
    this.categoriesService.deleteCategory(this.deleteCategoryId).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeDeleteModal();
        this.loadCategories();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete category';
        this.loading = false;
      }
    });
  }
}

