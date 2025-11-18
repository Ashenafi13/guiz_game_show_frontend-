import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService, Team } from '../../services/teams.service';
import { SeasonsService, Season } from '../../services/seasons.service';
import { ContestantsService, Contestant } from '../../services/contestants.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  seasons: Season[] = [];
  competitors: Contestant[] = [];
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showManageMembersModal: boolean = false;

  newTeam: Team = this.getEmptyTeam();
  editTeam: Team = this.getEmptyTeam();
  deleteTeamId: string = '';
  deleteTeamName: string = '';

  // For managing team members
  selectedTeam: Team | null = null;
  availableCompetitors: Contestant[] = [];
  selectedCompetitorId: number | null = null;

  constructor(
    private teamsService: TeamsService,
    private seasonsService: SeasonsService,
    private contestantsService: ContestantsService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadSeasons();
    this.loadCompetitors();
  }

  getEmptyTeam(): Team {
    return {
      name: '',
      seasonId: null,
      description: '',
      color: '#007bff',
      competitorIds: []
    };
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

  loadCompetitors(): void {
    this.contestantsService.getAllContestants().subscribe({
      next: (response) => {
        this.competitors = response.data || response;
      },
      error: (err) => {
        console.error('Failed to load competitors', err);
      }
    });
  }

  loadTeams(): void {
    this.loading = true;
    this.error = '';
    this.teamsService.getAllTeams().subscribe({
      next: (response) => {
        this.teams = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load teams';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.newTeam = this.getEmptyTeam();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(team: Team): void {
    this.editTeam = { ...team };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openDeleteModal(team: Team): void {
    this.deleteTeamId = team.id || '';
    this.deleteTeamName = team.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  addTeam(): void {
    if (!this.newTeam.name) {
      this.error = 'Team name is required';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.teamsService.createTeam(this.newTeam).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Team created successfully!';
        this.closeAddModal();
        this.loadTeams();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create team';
        this.loading = false;
      }
    });
  }

  updateTeam(): void {
    if (!this.editTeam._id) return;
    this.loading = true;
    this.error = '';
    this.teamsService.updateTeam(this.editTeam._id, this.editTeam).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeEditModal();
        this.loadTeams();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update team';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    console.log('Deleting team:', this.deleteTeamId);
    if (!this.deleteTeamId) return;
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.teamsService.deleteTeam(this.deleteTeamId).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Team deleted successfully!';
        this.closeDeleteModal();
        this.loadTeams();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete team';
        this.loading = false;
      }
    });
  }

  // Manage team members
  openManageMembersModal(team: Team): void {
    this.selectedTeam = { ...team };
    this.showManageMembersModal = true;
    this.updateAvailableCompetitors();
  }

  closeManageMembersModal(): void {
    this.showManageMembersModal = false;
    this.selectedTeam = null;
    this.selectedCompetitorId = null;
  }

  updateAvailableCompetitors(): void {
    if (!this.selectedTeam) return;

    const teamMemberIds = this.selectedTeam.members?.map(m => m.competitorId) || [];
    this.availableCompetitors = this.competitors.filter(
      c => !teamMemberIds.includes(c.id)
    );
  }

  addCompetitorToTeam(): void {
    if (!this.selectedTeam || !this.selectedCompetitorId) return;

    const teamId = this.selectedTeam._id || this.selectedTeam.id;
    if (!teamId) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.teamsService.addCompetitorToTeam(teamId, this.selectedCompetitorId).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Competitor added successfully!';
        this.selectedCompetitorId = null;
        this.loadTeams();

        // Update selected team with new data
        this.teamsService.getTeamById(teamId).subscribe({
          next: (teamResponse) => {
            this.selectedTeam = teamResponse.data || teamResponse;
            this.updateAvailableCompetitors();
          }
        });

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add competitor';
        this.loading = false;
      }
    });
  }

  removeCompetitorFromTeam(competitorId: string): void {
    if (!this.selectedTeam || !competitorId) return;

    const teamId = this.selectedTeam._id || this.selectedTeam.id;
    if (!teamId) return;

    if (!confirm('Are you sure you want to remove this competitor from the team?')) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.teamsService.removeCompetitorFromTeam(teamId, Number(competitorId)).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Competitor removed successfully!';
        this.loadTeams();

        // Update selected team with new data
        this.teamsService.getTeamById(teamId).subscribe({
          next: (teamResponse) => {
            this.selectedTeam = teamResponse.data || teamResponse;
            this.updateAvailableCompetitors();
          }
        });

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to remove competitor';
        this.loading = false;
      }
    });
  }

  getSeasonName(seasonId: number | null | undefined): string {
    if (!seasonId) return 'N/A';
    const season = this.seasons.find(s => s.id === seasonId.toString());
    return season ? season.name : 'N/A';
  }
}

