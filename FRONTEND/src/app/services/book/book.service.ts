import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private booksUrl="http://localhost:5000/api/book/get-all-books";
  private getBookByIdURL="http://localhost:5000/api/book/get-book-by-id";
  private getIssuedBooksURL ="http://localhost:5000/api/users/get-issued-books";
  constructor(private http: HttpClient) {

   }
   getAllBooks(){
    const token =localStorage.getItem('token')
    if(token){
      let headers = new HttpHeaders().set('x-auth-token', token);
      return this.http.get(this.booksUrl,{headers})
    }
    return ;
   }

   getBookById(bookId:string){
    const token =localStorage.getItem('token')
    if(token){
      let headers = new HttpHeaders().set('x-auth-token', token);
      return this.http.get(this.getBookByIdURL+"/"+bookId,{headers})
    }
    return ;
   }

   getIssuedBooks(){
    const token=localStorage.getItem('token')
    if(token){
      const headers = new HttpHeaders().set('x-auth-token',token);
      return this.http.get(this.getIssuedBooksURL, {headers})
    }
    return;
   }
}
