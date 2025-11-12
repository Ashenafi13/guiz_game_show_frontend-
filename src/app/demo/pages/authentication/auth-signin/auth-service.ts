import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from 'src/app/theme/shared/storage-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private storage:StorageService) { }
  httpOptions = {
    header: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization:
      //   'Basic ' +
      //   Buffer.from(
      //     this.storageService.getCode() + ':' + this.storageService.getValue()
      //   ).toString('base64'),
    }),
  };

    SignIn(userData:any){
    return this.http.post<any>(
      environment.URL + `/login`,
      userData,
      {
        headers: this.httpOptions.header,
      }
    );
  }

   isLoggedIn(): boolean {
    const authToken = this.storage.getToken();
    return authToken !== null && authToken !== undefined;
  }
}
