import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContestantsService, Contestant } from '../../services/contestants.service';
import { TeamsService } from '../../services/teams.service';

@Component({
  selector: 'app-contestants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contestants.component.html',
  styleUrls: ['./contestants.component.scss']
})
export class ContestantsComponent implements OnInit {
  contestants: Contestant[] = [];
  teams: any[] = [];
  loading: boolean = false;
  error: string = '';

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  // Form data
  newContestant: Contestant = this.getEmptyContestant();
  editContestant: Contestant = this.getEmptyContestant();
  deleteContestantId: string = '';
  deleteContestantName: string = '';

  constructor(
    private contestantsService: ContestantsService,
    private teamsService: TeamsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContestants();
    //this.loadTeams();
  }

  getEmptyContestant(): Contestant {
    return {
      name: ''

    };
  }

  // loadTeams(): void {
  //   this.teamsService.getAllTeams().subscribe({
  //     next: (response) => {
  //       this.teams = response.data || [];
  //     },
  //     error: (err) => {
  //       console.error('Error loading teams:', err);
  //     }
  //   });
  // }

  loadContestants(): void {
    this.loading = true;
    this.error = '';
    this.contestantsService.getAllContestants().subscribe({
      next: (response) => {
        this.contestants = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load contestants';
        this.loading = false;
      }
    });
  }

  // getTeamName(teamId: string): string {
  //   if (!teamId) return 'No Team';
  //   const team = this.teams.find(t => t._id === teamId);
  //   return team ? team.name : 'Unknown Team';
  // }

  // Modal methods
  openAddModal(): void {
    this.newContestant = this.getEmptyContestant();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newContestant = this.getEmptyContestant();
  }

  openEditModal(contestant: Contestant): void {
    this.editContestant = { ...contestant };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editContestant = this.getEmptyContestant();
  }

  openDeleteModal(contestant: Contestant): void {
    this.deleteContestantId = contestant.id || '';
    this.deleteContestantName = contestant.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteContestantId = '';
    this.deleteContestantName = '';
  }

  // CRUD operations
  addContestant(): void {
    this.loading = true;
    this.error = '';
    // console.log(this.newContestant);
    this.contestantsService.createContestant(this.newContestant).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeAddModal();
        this.loadContestants();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create contestant';
        this.loading = false;
      }
    });
  }

  updateContestant(): void {
    if (!this.editContestant.id) return;

    this.loading = true;
    this.error = '';
    this.contestantsService.updateContestant(this.editContestant.id, this.editContestant).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeEditModal();
        this.loadContestants();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update contestant';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.deleteContestantId) return;

    this.loading = true;
    this.error = '';
    this.contestantsService.deleteContestant(this.deleteContestantId).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeDeleteModal();
        this.loadContestants();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete contestant';
        this.loading = false;
      }
    });
  }
}

