import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionsService, Question } from '../../services/questions.service';
import { EpisodesService } from '../../services/episodes.service';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  questions: Question[] = [];
  episodes: any[] = [];
  loading: boolean = false;
  error: string = '';

  // Filter
  selectedEpisodeId: string = '';

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  // Form data
  newQuestion: Question = this.getEmptyQuestion();
  editQuestion: Question = this.getEmptyQuestion();
  deleteQuestionId: string = '';
  deleteQuestionText: string = '';

  // Question types
  questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' }
  ];

  difficulties = ['easy', 'medium', 'hard'];

  constructor(
    private questionsService: QuestionsService,
    private episodesService: EpisodesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEpisodes();

    // Check if there's an episodeId query parameter
    this.route.queryParams.subscribe(params => {
      if (params['episodeId']) {
        this.selectedEpisodeId = params['episodeId'];
        this.loadQuestionsByEpisode();
      } else {
        this.loadAllQuestions();
      }
    });
  }

  getEmptyQuestion(): Question {
    return {
      episodeId: '',
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10,
      difficulty: 'medium',
      timeLimit: 30,
      explanation: '',
      order: 1,
      isActive: true
    };
  }

  loadEpisodes(): void {
    this.episodesService.getAllEpisodes().subscribe({
      next: (response) => {
        this.episodes = response.data || [];
      },
      error: (err) => {
        console.error('Error loading episodes:', err);
      }
    });
  }

  loadAllQuestions(): void {
    this.loading = true;
    this.error = '';
    this.questionsService.getAllQuestions().subscribe({
      next: (response) => {
        this.questions = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load questions';
        this.loading = false;
      }
    });
  }

  loadQuestionsByEpisode(): void {
    if (!this.selectedEpisodeId) {
      this.loadAllQuestions();
      return;
    }

    this.loading = true;
    this.error = '';
    this.questionsService.getQuestionsByEpisode(this.selectedEpisodeId).subscribe({
      next: (response) => {
        this.questions = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load questions';
        this.loading = false;
      }
    });
  }

  onEpisodeFilterChange(): void {
    if (this.selectedEpisodeId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { episodeId: this.selectedEpisodeId },
        queryParamsHandling: 'merge'
      });
      this.loadQuestionsByEpisode();
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      });
      this.loadAllQuestions();
    }
  }

  getEpisodeName(episodeId: string): string {
    const episode = this.episodes.find(e => e._id === episodeId);
    return episode ? episode.title : 'Unknown Episode';
  }

  // Modal methods
  openAddModal(): void {
    this.newQuestion = this.getEmptyQuestion();
    if (this.selectedEpisodeId) {
      this.newQuestion.episodeId = this.selectedEpisodeId;
    }
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newQuestion = this.getEmptyQuestion();
  }

  openEditModal(question: Question): void {
    this.editQuestion = { ...question };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editQuestion = this.getEmptyQuestion();
  }

  openDeleteModal(question: Question): void {
    this.deleteQuestionId = question._id || '';
    this.deleteQuestionText = question.questionText;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteQuestionId = '';
    this.deleteQuestionText = '';
  }

  // CRUD operations
  addQuestion(): void {
    this.loading = true;
    this.error = '';
    this.questionsService.createQuestion(this.newQuestion).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeAddModal();
        if (this.selectedEpisodeId) {
          this.loadQuestionsByEpisode();
        } else {
          this.loadAllQuestions();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create question';
        this.loading = false;
      }
    });
  }

  updateQuestion(): void {
    if (!this.editQuestion._id) return;

    this.loading = true;
    this.error = '';
    this.questionsService.updateQuestion(this.editQuestion._id, this.editQuestion).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeEditModal();
        if (this.selectedEpisodeId) {
          this.loadQuestionsByEpisode();
        } else {
          this.loadAllQuestions();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update question';
        this.loading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.deleteQuestionId) return;

    this.loading = true;
    this.error = '';
    this.questionsService.deleteQuestion(this.deleteQuestionId).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeDeleteModal();
        if (this.selectedEpisodeId) {
          this.loadQuestionsByEpisode();
        } else {
          this.loadAllQuestions();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete question';
        this.loading = false;
      }
    });
  }

  // Helper methods for options
  addOption(): void {
    if (!this.newQuestion.options) {
      this.newQuestion.options = [];
    }
    this.newQuestion.options.push('');
  }

  removeOption(index: number): void {
    if (this.newQuestion.options) {
      this.newQuestion.options.splice(index, 1);
    }
  }

  addEditOption(): void {
    if (!this.editQuestion.options) {
      this.editQuestion.options = [];
    }
    this.editQuestion.options.push('');
  }

  removeEditOption(index: number): void {
    if (this.editQuestion.options) {
      this.editQuestion.options.splice(index, 1);
    }
  }
}
