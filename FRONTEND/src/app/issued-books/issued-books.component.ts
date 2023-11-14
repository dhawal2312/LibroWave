import { Component } from '@angular/core';
import { BookService } from '../services/book/book.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-issued-books',
  templateUrl: './issued-books.component.html',
  styleUrls: ['./issued-books.component.css']
})
export class IssuedBooksComponent {
  public books:any =[];
  public issuedBooksData:any;
  constructor(private userService:UserService,private bookService:BookService,private toastr: ToastrService,private spinner: NgxSpinnerService){
  }
  ngOnInit(){
    this.getIssuedBooks();
    
  }
  getIssuedBooks(){
    this.books=[];
    this.spinner.show();
    this.bookService.getIssuedBooks()?.subscribe((response:any) => {
      const observables = response.map((issuedBook: any) =>
      this.fetchBookDetails(issuedBook)
    );
      console.log("obs",observables);
      
    forkJoin(observables).subscribe(() => {
      this.spinner.hide();
      console.log("Book Info =", this.books);
    });

      this.spinner.hide();
      console.log("Book Info=",this.books)
    },(error)=>{
      this.spinner.hide();
      const errors = error.error.errors;
      errors.forEach((element:any) => {
        this.toastr.error(element.msg);
      });
    })
    console.log(this.books);
    
  }
  
  fetchBookDetails(issuedBook: any) {
    this.books=[];
    return this.bookService.getBookById(issuedBook.book)?.pipe(
      map((response:any) => {
        console.log("RES", response);
  
        const bookData = {
          bookDetail: response,
          bookIssueInfo: issuedBook,
        };
        console.log("BookData", bookData);
  
        this.books.push(bookData);
      })
    );
  }

  reIssueBook(bookId:string){
    this.userService.reIssueBook(bookId)?.subscribe((response:any) => {
      console.log(response);
      this.toastr.success(response.msg);
      this.getIssuedBooks();
    },(error)=>{
      console.log(error);
      
      const errors = error.error.errors;
      console.log(errors)
      errors.forEach((element:any) => {
        this.toastr.error(element.msg);
      });
    })
  }

  returnBook(bookId:string){
    this.userService.returnBook(bookId)?.subscribe((response:any) => {
      console.log(response);
      this.toastr.success(response.msg);
      this.getIssuedBooks();
    },(error)=>{
      console.log(error);
      
      const errors = error.error.errors;
      console.log(errors)
      errors.forEach((element:any) => {
        this.toastr.error(element.msg);
      });
    })
  }
}
