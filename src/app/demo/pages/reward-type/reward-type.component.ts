import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RewardType, RewardTypeService } from '../../services/reawrd-type.service';

@Component({
  selector: 'app-reward-type',
  imports: [CommonModule, SharedModule],
  templateUrl: './reward-type.component.html',
  styleUrl: './reward-type.component.scss'
})
export class RewardTypeComponent {
  rewardTypes: RewardType[] = [];
  loading: boolean = false;
  error: string = '';

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  newRewardType: RewardType = this.getEmptyRewardType();
  editRewardType: RewardType = this.getEmptyRewardType();
  deleteRewardTypeId: string = '';
  deleteRewardTypeName: string = '';

  constructor(private rewardTypeService: RewardTypeService) {}

  ngOnInit(): void {
    this.loadRewardTypes();
  }

  getEmptyRewardType(): RewardType {
    return {
      name: '',
      measurement: ''
    };
  }

  loadRewardTypes(): void {
    this.loading = true;
    this.error = '';
    this.rewardTypeService.getAllRewardTypes().subscribe({
      next: (response) => {
        this.rewardTypes = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load reward types';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.newRewardType = this.getEmptyRewardType();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(RewardType: RewardType): void {
    this.editRewardType = { ...RewardType };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openDeleteModal(RewardType: RewardType): void {
    this.deleteRewardTypeId = RewardType.id || '';
    this.deleteRewardTypeName = RewardType.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  addRewardType(): void {
    this.loading = true;
    this.error = '';
    this.rewardTypeService.createRewardTypes(this.newRewardType).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeAddModal();
        this.loadRewardTypes();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create RewardType';
        this.loading = false;
      }
    });
  }

  updateRewardType(): void {
    if (!this.editRewardType.id) return;
    this.loading = true;
    this.error = '';
    this.rewardTypeService.updateRewardTypes(this.editRewardType.id, this.editRewardType).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeEditModal();
        this.loadRewardTypes();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update RewardType';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.deleteRewardTypeId) return;
    this.loading = true;
    this.error = '';
    this.rewardTypeService.deleteRewardTypes(this.deleteRewardTypeId).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeDeleteModal();
        this.loadRewardTypes();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete RewardType';
        this.loading = false;
      }
    });
  }
}
