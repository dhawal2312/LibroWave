import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 
  
  }
  public isAuthenticated = new Subject<boolean>();
  private loginUrl='http://localhost:5000/api/auth';
  private registerUrl='http://localhost:5000/api/users';
 
  login(email:string,password:string):Observable <any>{
    const body = {
      email:email,
      password:password
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.loginUrl,body,{headers})
  }
  changeAuthentication(value:boolean){
    this.isAuthenticated.next(value);
  }

  register(name:string,email:string,password:string){
    const body ={
      name:name,
      email:email,
      password:password
    }
    return this.http.post(this.registerUrl,body);
  }
}
