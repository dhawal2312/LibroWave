import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  private getUserDetailsUrl='http://localhost:5000/api/auth';
  private reIssueBookURL="http://localhost:5000/api/users/reIssue-book";
  private returnBookURL="http://localhost:5000/api/users/return-book";
  private issueBookURL="http://localhost:5000/api/users/issue-book";

  getUserDetails(){
    const token =localStorage.getItem('token')
    if(token){
      let headers = new HttpHeaders().set('x-auth-token', token);
      return this.http.get(this.getUserDetailsUrl,{headers})
    }
    return ;
  }

  reIssueBook(bookId:string){
    const token =localStorage.getItem('token')
    if(token){
      let headers = new HttpHeaders().set('x-auth-token', token);
      return this.http.post(this.reIssueBookURL+'/'+bookId,null,{headers})
    }

    return ;
  }

  returnBook(bookId:string){
    const token =localStorage.getItem('token')
    if(token){
      let headers = new HttpHeaders().set('x-auth-token', token);
      return this.http.post(this.returnBookURL+'/'+bookId,null,{headers})
    }
    return ;
  }

  issueBook(bookId:string){
    const token =localStorage.getItem('token')
    if(token){
      let headers = new HttpHeaders().set('x-auth-token', token);
      return this.http.post(this.issueBookURL+'/'+bookId,null,{headers})
    }
    return ;
  }

}
