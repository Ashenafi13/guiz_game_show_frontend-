import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EpisodesService, Episode } from '../../services/episodes.service';
import { SeasonsService, Season } from '../../services/seasons.service';

@Component({
  selector: 'app-episodes',
  imports: [RouterModule, SharedModule, CommonModule],
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {
  episodes: Episode[] = [];
  seasons: Season[] = [];
  selectedSeasonId: string = '';
  loading: boolean = false;
  error: string = '';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedEpisode: Episode | null = null;

  newEpisode: Episode = {
    seasonId: '',
    name: '',
    isActive: true
  };

  constructor(
    private episodesService: EpisodesService,
    private seasonsService: SeasonsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSeasons();
    this.route.queryParams.subscribe(params => {
      if (params['seasonId']) {
        this.selectedSeasonId = params['seasonId'];
        this.loadEpisodesBySeason(this.selectedSeasonId);
      } else {
        this.loadAllEpisodes();
      }
    });
  }

  loadSeasons(): void {
    this.seasonsService.getAllSeasons().subscribe({
      next: (response) => {
        this.seasons = response.data || response;
      },
      error: (err) => {
        console.error('Failed to load seasons', err);
      }
    });
  }

  loadAllEpisodes(): void {
    this.loading = true;
    this.error = '';
    this.episodesService.getAllEpisodes().subscribe({
      next: (response) => {
        this.episodes = response.data || response;
        this.loading = false;
        this.episodes.forEach(episode => {
          episode.isActive = episode.status === 'active'?true:false;
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load episodes';
        this.loading = false;
      }
    });
  }

  loadEpisodesBySeason(seasonId: string): void {
    this.loading = true;
    this.error = '';
    this.episodesService.getEpisodesBySeason(seasonId).subscribe({
      next: (response) => {
        this.episodes = response.data || response;
        this.loading = false;
        this.episodes.forEach(episode => {
          episode.isActive = episode.status === 'active'?true:false;
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load episodes';
        this.loading = false;
      }
    });
  }

  onSeasonFilterChange(): void {
    if (this.selectedSeasonId) {
      this.router.navigate(['/episodes'], { queryParams: { seasonId: this.selectedSeasonId } });
    } else {
      this.router.navigate(['/episodes']);
    }
  }

  openAddModal(): void {
    this.newEpisode = {
      seasonId: this.selectedSeasonId || '',
      name: '',
      isActive: true
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(episode: Episode): void {
    this.selectedEpisode = { ...episode };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEpisode = null;
  }

  openDeleteModal(episode: Episode): void {
    this.selectedEpisode = episode;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedEpisode = null;
  }

  addEpisode(): void {
    this.loading = true;
    this.newEpisode.isActive?this.newEpisode.status = 'active':this.newEpisode.status = 'inactive';
    this.episodesService.createEpisode(this.newEpisode).subscribe({
      next: () => {
        this.loading = false;
        this.closeAddModal();
        if (this.selectedSeasonId) {
          this.loadEpisodesBySeason(this.selectedSeasonId);
        } else {
          this.loadAllEpisodes();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create episode';
        this.loading = false;
      }
    });
  }

  updateEpisode(): void {
    if (!this.selectedEpisode || !this.selectedEpisode.id) return;
    this.selectedEpisode.isActive?this.selectedEpisode.status = 'active':this.selectedEpisode.status = 'inactive';
    this.loading = true;

    this.episodesService.updateEpisode(this.selectedEpisode.id, this.selectedEpisode).subscribe({
      next: () => {
        this.loading = false;
        this.closeEditModal();
        if (this.selectedSeasonId) {
          this.loadEpisodesBySeason(this.selectedSeasonId);
        } else {
          this.loadAllEpisodes();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update episode';
        this.loading = false;
      }
    });
  }

  deleteEpisode(): void {
    if (!this.selectedEpisode || !this.selectedEpisode.id) return;

    this.loading = true;
    this.episodesService.deleteEpisode(this.selectedEpisode.id).subscribe({
      next: () => {
        this.loading = false;
        this.closeDeleteModal();
        if (this.selectedSeasonId) {
          this.loadEpisodesBySeason(this.selectedSeasonId);
        } else {
          this.loadAllEpisodes();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete episode';
        this.loading = false;
      }
    });
  }

  getSeasonName(seasonId: string): string {
    const season = this.seasons.find(s => s.id === seasonId);
    return season ? season.name : 'Unknown';
  }
}
