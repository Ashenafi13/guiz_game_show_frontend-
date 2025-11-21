// angular import
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService, UserProfile } from 'src/app/demo/services/user.service';
import { AuthService } from 'src/app/demo/pages/authentication/auth-signin/auth-service';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  // public props
  userProfile: UserProfile | null = null;
  fullName: string = 'John Doe';

  // constructor
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.userProfile = response.data;
          this.fullName = response.data.fullName || 'John Doe';
        }
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.fullName = 'John Doe';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
