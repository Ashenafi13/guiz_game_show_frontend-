import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService, Team } from '../../services/teams.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  loading: boolean = false;
  error: string = '';

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  newTeam: Team = this.getEmptyTeam();
  editTeam: Team = this.getEmptyTeam();
  deleteTeamId: string = '';
  deleteTeamName: string = '';

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  getEmptyTeam(): Team {
    return {
      name: '',
      description: '',
      color: '#007bff',
      captain: '',
      totalScore: 0,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      isActive: true
    };
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
    this.deleteTeamId = team._id || '';
    this.deleteTeamName = team.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  addTeam(): void {
    this.loading = true;
    this.error = '';
    this.teamsService.createTeam(this.newTeam).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeAddModal();
        this.loadTeams();
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
    if (!this.deleteTeamId) return;
    this.loading = true;
    this.error = '';
    this.teamsService.deleteTeam(this.deleteTeamId).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeDeleteModal();
        this.loadTeams();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete team';
        this.loading = false;
      }
    });
  }
}

