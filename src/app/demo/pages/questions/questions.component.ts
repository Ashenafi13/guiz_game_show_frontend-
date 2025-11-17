import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionsService, Question, QuestionChoice, Pagination } from '../../services/questions.service';
import { CategoriesService, Category } from '../../services/categories.service';
import { RewardTypeService, RewardType } from '../../services/reawrd-type.service';
import { EpisodesService, Episode } from '../../services/episodes.service';
import { SeasonsService, Season } from '../../services/seasons.service';
import { EpisodeQuestionsService } from '../../services/episode-questions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  questions: Question[] = [];
  categories: Category[] = [];
  rewardTypes: RewardType[] = [];
  episodes: Episode[] = [];
  seasons: Season[] = [];
  loading: boolean = false;
  error: string = '';
  environment = environment;
  Math = Math; // For template usage

  // Pagination
  pagination: Pagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Filter
  selectedCategoryId: string = '';

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showBulkAssignModal: boolean = false;

  // Bulk selection
  selectedQuestions: Set<string> = new Set();
  bulkAssignData = {
    episodeId: '',
    seasonId: ''
  };

  // Form data
  newQuestion: any = this.getEmptyQuestion();
  editQuestion: any = this.getEmptyQuestion();
  deleteQuestionId: string = '';
  deleteQuestionText: string = '';

  // File upload
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;
  editFilePreviewUrl: string | null = null;

  // Question types
  questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'short_answer', label: 'Short Answer' }
  ];

  fileTypes = [
    { value: 'text', label: 'Text Only' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' }
  ];

  constructor(
    private questionsService: QuestionsService,
    private categoriesService: CategoriesService,
    private rewardTypeService: RewardTypeService,
    private episodesService: EpisodesService,
    private seasonsService: SeasonsService,
    private episodeQuestionsService: EpisodeQuestionsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadRewardTypes();
    this.loadSeasons();
    this.loadEpisodes();

    // Check if there's a categoryId query parameter
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategoryId = params['categoryId'];
        this.loadQuestionsByCategory();
      } else {
        this.loadAllQuestions();
      }
    });
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.selectedCategoryId) {
      this.loadQuestionsByCategory();
    } else {
      this.loadAllQuestions();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Reset to first page
    if (this.selectedCategoryId) {
      this.loadQuestionsByCategory();
    } else {
      this.loadAllQuestions();
    }
  }

  get totalPages(): number {
    return this.pagination.totalPages;
  }

  get pages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getEmptyQuestion(): any {
    return {
      question: '',
      categoryId: '',
      type: 'multiple_choice',
      rewardType: '',
      point: 10,
      fileType: 'text',
      choices: [
        { choose: '', isAnswer: true },
        { choose: '', isAnswer: false },
        { choose: '', isAnswer: false },
        { choose: '', isAnswer: false }
      ]
    };
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadRewardTypes(): void {
    this.rewardTypeService.getAllRewardTypes().subscribe({
      next: (response) => {
        this.rewardTypes = response.data || [];
      },
      error: (err) => {
        console.error('Error loading reward types:', err);
      }
    });
  }

  loadSeasons(): void {
    this.seasonsService.getAllSeasons().subscribe({
      next: (response) => {
        this.seasons = response.data || [];
      },
      error: (err) => {
        console.error('Error loading seasons:', err);
      }
    });
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

  onSeasonChange(seasonId: string): void {
    if (seasonId) {
      this.episodesService.getEpisodesBySeason(seasonId).subscribe({
        next: (response) => {
          this.episodes = response.data || [];
        },
        error: (err) => {
          console.error('Error loading episodes by season:', err);
        }
      });
    } else {
      this.loadEpisodes();
    }
  }

  loadAllQuestions(): void {
    this.loading = true;
    this.error = '';
    console.log('Loading questions - Page:', this.currentPage, 'Limit:', this.itemsPerPage);
    this.questionsService.getAllQuestions(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        console.log('Questions API Response:', response);

        // Handle new paginated response structure
        if (response && response.success && response.data && response.data.data) {
          this.questions = response.data.data || [];
          this.pagination = response.data.pagination || {
            total: this.questions.length,
            page: this.currentPage,
            limit: this.itemsPerPage,
            totalPages: 1
          };
          console.log('Questions loaded (paginated):', this.questions.length);
          console.log('Pagination:', this.pagination);
        }
        // Handle old response structure (fallback)
        else if (response && response.data && Array.isArray(response.data)) {
          this.questions = response.data;
          this.pagination = {
            total: this.questions.length,
            page: 1,
            limit: this.questions.length,
            totalPages: 1
          };
          console.log('Questions loaded (legacy format):', this.questions.length);
        }
        // Handle direct array response
        else if (Array.isArray(response)) {
          this.questions = response;
          this.pagination = {
            total: this.questions.length,
            page: 1,
            limit: this.questions.length,
            totalPages: 1
          };
          console.log('Questions loaded (direct array):', this.questions.length);
        } else {
          console.warn('Response structure unexpected:', response);
          this.questions = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading questions:', err);
        this.error = err.error?.message || 'Failed to load questions';
        this.loading = false;
      }
    });
  }

  loadQuestionsByCategory(): void {
    if (!this.selectedCategoryId) {
      this.loadAllQuestions();
      return;
    }

    this.loading = true;
    this.error = '';
    console.log('Loading questions by category:', this.selectedCategoryId, 'Page:', this.currentPage, 'Limit:', this.itemsPerPage);
    this.questionsService.getQuestionsByCategory(this.selectedCategoryId, this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        console.log('Questions by Category API Response:', response);

        // Handle new paginated response structure
        if (response && response.success && response.data && response.data.data) {
          this.questions = response.data.data || [];
          this.pagination = response.data.pagination || {
            total: this.questions.length,
            page: this.currentPage,
            limit: this.itemsPerPage,
            totalPages: 1
          };
          console.log('Questions loaded (paginated):', this.questions.length);
          console.log('Pagination:', this.pagination);
        }
        // Handle old response structure (fallback)
        else if (response && response.data && Array.isArray(response.data)) {
          this.questions = response.data;
          this.pagination = {
            total: this.questions.length,
            page: 1,
            limit: this.questions.length,
            totalPages: 1
          };
          console.log('Questions loaded (legacy format):', this.questions.length);
        }
        // Handle direct array response
        else if (Array.isArray(response)) {
          this.questions = response;
          this.pagination = {
            total: this.questions.length,
            page: 1,
            limit: this.questions.length,
            totalPages: 1
          };
          console.log('Questions loaded (direct array):', this.questions.length);
        } else {
          console.warn('Response structure unexpected:', response);
          this.questions = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading questions by category:', err);
        this.error = err.error?.message || 'Failed to load questions';
        this.loading = false;
      }
    });
  }

  onCategoryFilterChange(): void {
    if (this.selectedCategoryId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { categoryId: this.selectedCategoryId },
        queryParamsHandling: 'merge'
      });
      this.loadQuestionsByCategory();
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      });
      this.loadAllQuestions();
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  getRewardTypeName(rewardTypeId: string): string {
    const rewardType = this.rewardTypes.find(r => r.id === rewardTypeId);
    return rewardType ? rewardType.name : 'Unknown';
  }

  // Modal methods
  openAddModal(): void {
    this.newQuestion = this.getEmptyQuestion();
    if (this.selectedCategoryId) {
      this.newQuestion.categoryId = this.selectedCategoryId;
    }
    this.selectedFile = null;
    this.filePreviewUrl = null;
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newQuestion = this.getEmptyQuestion();
    this.selectedFile = null;
    this.filePreviewUrl = null;
  }

  openEditModal(question: Question): void {
    this.editQuestion = {
      ...question,
      choices: question.choices ? [...question.choices] : []
    };
    this.editFilePreviewUrl = question.filepath ? `${environment.IP}${question.filepath}` : null;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editQuestion = this.getEmptyQuestion();
    this.editFilePreviewUrl = null;
  }

  openDeleteModal(question: Question): void {
    this.deleteQuestionId = question._id || question.id || '';
    this.deleteQuestionText = question.question || question.questionText || '';
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteQuestionId = '';
    this.deleteQuestionText = '';
  }

  // File upload handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // Auto-detect file type
      if (file.type.startsWith('image/')) {
        this.newQuestion.fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        this.newQuestion.fileType = 'video';
      } else if (file.type.startsWith('audio/')) {
        this.newQuestion.fileType = 'audio';
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.filePreviewUrl = null;
    this.newQuestion.fileType = 'text';
  }

  // CRUD operations
  addQuestion(): void {
    // Validate form
    if (!this.newQuestion.question || !this.newQuestion.categoryId || !this.newQuestion.rewardType) {
      this.error = 'Please fill in all required fields';
      return;
    }

    // Validate choices for multiple choice
    if (this.newQuestion.type === 'multiple_choice') {
      const hasCorrectAnswer = this.newQuestion.choices.some((c: QuestionChoice) => c.isAnswer);
      if (!hasCorrectAnswer) {
        this.error = 'Please select at least one correct answer';
        return;
      }
      const hasEmptyChoice = this.newQuestion.choices.some((c: QuestionChoice) => !c.choose.trim());
      if (hasEmptyChoice) {
        this.error = 'Please fill in all choices';
        return;
      }
    }

    this.loading = true;
    this.error = '';

    // Create FormData
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    formData.append('question', this.newQuestion.question);
    formData.append('categoryId', this.newQuestion.categoryId);
    formData.append('type', this.newQuestion.type);
    formData.append('rewardType', this.newQuestion.rewardType);
    formData.append('point', this.newQuestion.point.toString());

    // Convert choices to the format expected by the API
    const choicesForApi = this.newQuestion.choices.map((c: QuestionChoice) => ({
      choose: c.choose,
      isAnswer: c.isAnswer ? 1 : 0
    }));
    formData.append('choices', JSON.stringify(choicesForApi));

    this.questionsService.createQuestion(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeAddModal();
        if (this.selectedCategoryId) {
          this.loadQuestionsByCategory();
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
    const questionId = this.editQuestion._id || this.editQuestion.id;
    if (!questionId) return;

    this.loading = true;
    this.error = '';

    // Create FormData for update
    const formData = new FormData();

    formData.append('question', this.editQuestion.question);
    formData.append('categoryId', this.editQuestion.categoryId);
    formData.append('type', this.editQuestion.type);
    formData.append('rewardType', this.editQuestion.rewardType);
    formData.append('point', this.editQuestion.point.toString());

    const choicesForApi = this.editQuestion.choices.map((c: QuestionChoice) => ({
      choose: c.choose,
      isAnswer: c.isAnswer ? 1 : 0
    }));
    formData.append('choices', JSON.stringify(choicesForApi));

    this.questionsService.updateQuestion(questionId, formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.closeEditModal();
        if (this.selectedCategoryId) {
          this.loadQuestionsByCategory();
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
        if (this.selectedCategoryId) {
          this.loadQuestionsByCategory();
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

  // Helper methods for choices
  addChoice(): void {
    if (!this.newQuestion.choices) {
      this.newQuestion.choices = [];
    }
    this.newQuestion.choices.push({ choose: '', isAnswer: false });
  }

  removeChoice(index: number): void {
    if (this.newQuestion.choices && this.newQuestion.choices.length > 2) {
      this.newQuestion.choices.splice(index, 1);
    }
  }

  setCorrectAnswer(index: number): void {
    // For multiple choice, only one answer can be correct
    this.newQuestion.choices.forEach((choice: QuestionChoice, i: number) => {
      choice.isAnswer = i === index;
    });
  }

  addEditChoice(): void {
    if (!this.editQuestion.choices) {
      this.editQuestion.choices = [];
    }
    this.editQuestion.choices.push({ choose: '', isAnswer: false });
  }

  removeEditChoice(index: number): void {
    if (this.editQuestion.choices && this.editQuestion.choices.length > 2) {
      this.editQuestion.choices.splice(index, 1);
    }
  }

  setEditCorrectAnswer(index: number): void {
    this.editQuestion.choices.forEach((choice: QuestionChoice, i: number) => {
      choice.isAnswer = i === index;
    });
  }

  getCorrectAnswerText(question: Question): string {
    if (!question.choices || question.choices.length === 0) {
      return 'N/A';
    }
    const correctChoice = question.choices.find(c => c.isAnswer);
    return correctChoice ? correctChoice.choose : 'N/A';
  }

  // Bulk selection methods
  toggleQuestionSelection(questionId: string): void {
    if (this.selectedQuestions.has(questionId)) {
      this.selectedQuestions.delete(questionId);
    } else {
      this.selectedQuestions.add(questionId);
    }
  }

  isQuestionSelected(questionId: string): boolean {
    return this.selectedQuestions.has(questionId);
  }

  selectAllQuestions(): void {
    this.questions.forEach(q => {
      if (q.id) this.selectedQuestions.add(q.id);
    });
  }

  deselectAllQuestions(): void {
    this.selectedQuestions.clear();
  }

  get hasSelectedQuestions(): boolean {
    return this.selectedQuestions.size > 0;
  }

  // Bulk assign modal
  openBulkAssignModal(): void {
    if (this.selectedQuestions.size === 0) {
      alert('Please select at least one question');
      return;
    }
    this.bulkAssignData = {
      episodeId: '',
      seasonId: ''
    };
    this.showBulkAssignModal = true;
  }

  closeBulkAssignModal(): void {
    this.showBulkAssignModal = false;
  }

  bulkAssignToEpisode(): void {
    if (!this.bulkAssignData.episodeId || !this.bulkAssignData.seasonId) {
      alert('Please select both season and episode');
      return;
    }

    const questionIds = Array.from(this.selectedQuestions).map(id => parseInt(id));

    this.loading = true;
    this.episodeQuestionsService.bulkAssignQuestionsToEpisode(
      this.bulkAssignData.episodeId,
      {
        seasonId: this.bulkAssignData.seasonId,
        questionIds: questionIds
      }
    ).subscribe({
      next: (response) => {
        console.log('Bulk assign response:', response);
        alert(`Successfully assigned ${questionIds.length} questions to episode`);
        this.closeBulkAssignModal();
        this.deselectAllQuestions();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error bulk assigning questions:', err);
        this.error = err.error?.message || 'Failed to assign questions to episode';
        this.loading = false;
      }
    });
  }

  // Get season name by ID
  getSeasonName(seasonId: string): string {
    const season = this.seasons.find(s => s.id === seasonId);
    return season ? season.name : 'Unknown';
  }

  // Get episode name by ID
  getEpisodeName(episodeId: string): string {
    const episode = this.episodes.find(e => e.id === episodeId);
    return episode ? episode.name : 'Unknown';
  }
}
