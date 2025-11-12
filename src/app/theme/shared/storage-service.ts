import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  setUserId(userId: any):void{
    localStorage.setItem('userId', userId);
  }

  checkHead(head:any):any{
    localStorage.setItem('isHead', head);
  }
  getcheckHead():any{
    let isHead = localStorage.getItem('isHead');
    return isHead;
  }

  getUserId(){
    let userId = localStorage.getItem('userId');
    return userId;
  }

 setToken(token:any):void{
  localStorage.setItem('token', token);
 }

 getToken(){
  let token = localStorage.getItem('token');
  return token;
 }

}
