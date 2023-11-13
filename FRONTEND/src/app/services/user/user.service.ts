import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  private getUserDetailsUrl='http://localhost:5000/api/auth';

  getUserDetails(){
    const token =localStorage.getItem('token')
    if(token){
      let headers = new HttpHeaders().set('x-auth-token', token);
      return this.http.get(this.getUserDetailsUrl,{headers})
    }
    return ;
  }
}
