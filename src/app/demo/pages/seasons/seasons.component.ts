import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SeasonsService, Season } from '../../services/seasons.service';

@Component({
  selector: 'app-seasons',
  imports: [RouterModule, SharedModule, CommonModule],
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnInit {
  seasons: Season[] = [];
  loading: boolean = false;
  error: string = '';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedSeason: Season | null = null;

  newSeason: Season = {
    name: '',
    description: '',
    status:'',
    isActive: true
  };

  constructor(
    private seasonsService: SeasonsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.loading = true;
    this.error = '';
    this.seasonsService.getAllSeasons().subscribe({
      next: (response) => {
        this.seasons = response.data || response;
        this.seasons.forEach(season => {
          season.isActive = season.status === 'active'?true:false;
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load seasons';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.newSeason = {
      name: '',
      description: '',
      status:'',
      isActive: true
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(season: Season): void {

    season.isActive = season.status === 'active'?true:false;
    this.selectedSeason = { ...season };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedSeason = null;
  }

  openDeleteModal(season: Season): void {
    this.selectedSeason = season;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedSeason = null;
  }

  addSeason(): void {
    this.loading = true;
    this.seasonsService.createSeason(this.newSeason).subscribe({
      next: () => {
        this.loading = false;
        this.closeAddModal();
        this.loadSeasons();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create season';
        this.loading = false;
      }
    });
  }

  updateSeason(): void {

     if (!this.selectedSeason || !this.selectedSeason.id) return;
     this.selectedSeason.isActive?this.selectedSeason.status = 'active':this.selectedSeason.status = 'inactive';

    this.loading = true;
    this.seasonsService.updateSeason(this.selectedSeason.id, this.selectedSeason).subscribe({
      next: () => {
        this.loading = false;
        this.closeEditModal();
        this.loadSeasons();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update season';
        this.loading = false;
      }
    });
  }

  deleteSeason(): void {
    if (!this.selectedSeason || !this.selectedSeason.id) return;

    this.loading = true;
    this.seasonsService.deleteSeason(this.selectedSeason.id).subscribe({
      next: () => {
        this.loading = false;
        this.closeDeleteModal();
        this.loadSeasons();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete season';
        this.loading = false;
      }
    });
  }

  viewEpisodes(seasonId: string): void {
    this.router.navigate(['/episodes'], { queryParams: { seasonId } });
  }
}

