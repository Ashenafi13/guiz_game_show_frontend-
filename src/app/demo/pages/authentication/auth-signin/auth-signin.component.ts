
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth-service';
import { StorageService } from 'src/app/theme/shared/storage-service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-auth-signup',
  imports: [RouterModule,SharedModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent {
  username:any;
  password:any;
  loading:boolean = false;
  error:any;
  permissions:any[] =[];
  navigation:any;

  constructor(private router: Router,private authservice:AuthService
    ,private storage:StorageService){}


    ngOnInit(): void {
    }

    async signIn(){
      this.loading = true;
      let datauser = {
        username:this.username,
        password:this.password
      }
      this.authservice.SignIn(datauser).subscribe({
        next:(response)=> {
          this.loading = false;

          this.storage.setToken(response.data.token);
          this.storage.setUserId(response.data.userid);
           this.router.navigate(['/dashboard']);
        },
        error:(err)=>{
          this.loading = false;
          this.error = err.error.message;
          console.error('❌ Login error:', err);
        }
      })
    }

}

