import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompetitionsService, Competition } from '../../services/competitions.service';
import { SeasonsService, Season } from '../../services/seasons.service';
import { EpisodesService, Episode } from '../../services/episodes.service';
import { TeamsService, Team } from '../../services/teams.service';

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})
export class CompetitionsComponent implements OnInit {
  competitions: Competition[] = [];
  seasons: Season[] = [];
  episodes: Episode[] = [];
  teams: Team[] = [];

  selectedSeasonId = '';
  selectedEpisodeId = '';

  loading = false;
  error = '';
  successMessage = '';

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  newCompetition: Competition = this.getEmptyCompetition();
  editCompetition: Competition | null = null;
  selectedCompetition: Competition | null = null;

  constructor(
    private competitionsService: CompetitionsService,
    private seasonsService: SeasonsService,
    private episodesService: EpisodesService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.loadFilters();
    this.loadAllCompetitions();
  }

  getEmptyCompetition(): Competition {
    return {
      seasonId: this.selectedSeasonId || '',
      episodeId: this.selectedEpisodeId || '',
      teams: []
    };
  }

  loadFilters(): void {
    this.seasonsService.getAllSeasons().subscribe({
      next: (response) => {
        this.seasons = response.data || response;
      },
      error: (err) => {
        console.error('Failed to load seasons', err);
      }
    });

    this.episodesService.getAllEpisodes().subscribe({
      next: (response) => {
        this.episodes = response.data || response;
      },
      error: (err) => {
        console.error('Failed to load episodes', err);
      }
    });

    this.teamsService.getAllTeams().subscribe({
      next: (response) => {
        this.teams = response.data || response;
      },
      error: (err) => {
        console.error('Failed to load teams', err);
      }
    });
  }

  loadAllCompetitions(): void {
    this.loading = true;
    this.error = '';
    this.competitionsService.getAllCompetitions().subscribe({
      next: (response) => {
        this.competitions = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load competitions';
        this.loading = false;
      }
    });
  }

  loadCompetitionsBySeason(seasonId: string): void {
    this.loading = true;
    this.error = '';
    this.competitionsService.getCompetitionsBySeason(seasonId).subscribe({
      next: (response) => {
        this.competitions = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load competitions';
        this.loading = false;
      }
    });
  }

  loadCompetitionsByEpisode(episodeId: string): void {
    this.loading = true;
    this.error = '';
    this.competitionsService.getCompetitionsByEpisode(episodeId).subscribe({
      next: (response) => {
        this.competitions = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load competitions';
        this.loading = false;
      }
    });
  }

  onSeasonChange(): void {
    this.selectedEpisodeId = '';
    this.onFilterChange();
  }

  onEpisodeChange(): void {
    this.onFilterChange();
  }

  onFilterChange(): void {
    if (this.selectedEpisodeId) {
      this.loadCompetitionsByEpisode(this.selectedEpisodeId);
    } else if (this.selectedSeasonId) {
      this.loadCompetitionsBySeason(this.selectedSeasonId);
    } else {
      this.loadAllCompetitions();
    }
  }

  openAddModal(): void {
    this.newCompetition = this.getEmptyCompetition();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(comp: Competition): void {
    const teamIds = (comp.teams || []).map((team: any) =>
      typeof team === 'object' ? (team.id ?? (team as any)._id) : team
    );
    this.editCompetition = { ...comp, teams: teamIds };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editCompetition = null;
  }

  openDeleteModal(comp: Competition): void {
    this.selectedCompetition = comp;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedCompetition = null;
  }

  addCompetition(): void {
    if (!this.newCompetition.seasonId || !this.newCompetition.episodeId || !this.newCompetition.teams?.length) {
      this.error = 'Season, episode and at least one team are required';
      return;
    }
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.competitionsService.createCompetition(this.newCompetition).subscribe({
      next: () => {
        this.loading = false;
        this.closeAddModal();
        this.loadAllCompetitions();
        this.successMessage = 'Competition created successfully';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create competition';
        this.loading = false;
      }
    });
  }

  updateCompetition(): void {
    if (!this.editCompetition || !this.editCompetition.id) return;
    this.loading = true;
    this.error = '';
    this.competitionsService.updateCompetition(this.editCompetition.id, this.editCompetition).subscribe({
      next: () => {
        this.loading = false;
        this.closeEditModal();
        this.loadAllCompetitions();
        this.successMessage = 'Competition updated successfully';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update competition';
        this.loading = false;
      }
    });
  }

  deleteCompetition(): void {
    if (!this.selectedCompetition || !this.selectedCompetition.id) return;
    this.loading = true;
    this.error = '';
    this.competitionsService.deleteCompetition(this.selectedCompetition.id).subscribe({
      next: () => {
        this.loading = false;
        this.closeDeleteModal();
        this.loadAllCompetitions();
        this.successMessage = 'Competition deleted successfully';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete competition';
        this.loading = false;
      }
    });
  }

  getEpisodesForSeason(seasonId?: string): Episode[] {
    const id = seasonId || this.selectedSeasonId;
    if (!id) return this.episodes;
    return this.episodes.filter((e) => e.seasonId === id);
  }

  getSeasonName(id?: string): string {
    if (!id) return 'N/A';
    const season = this.seasons.find((s) => s.id === id.toString());
    return season ? season.name : 'N/A';
  }

  getEpisodeName(id?: string): string {
    if (!id) return 'N/A';
    const episode = this.episodes.find((e) => e.id === id.toString());
    return episode ? episode.name : 'N/A';
  }

  getTeamName(team: any): string {
    if (team && typeof team === 'object') {
      if (team.name) {
        return team.name;
      }
      if (team.id) {
        return `#${team.id}`;
      }
    }
    const id = team?.toString();
    if (!id) {
      return '#-';
    }
    const found = this.teams.find((t) => t.id?.toString() === id || (t as any)._id?.toString() === id);
    return found ? found.name : `#${id}`;
  }
}

