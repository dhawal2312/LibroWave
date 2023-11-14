import { Component } from '@angular/core';
import { BookService } from '../services/book/book.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-returned-books',
  templateUrl: './returned-books.component.html',
  styleUrls: ['./returned-books.component.css']
})
export class ReturnedBooksComponent {
  public books:any =[];
  constructor(private bookService:BookService,private spinner: NgxSpinnerService,private toastr: ToastrService){

  }
  ngOnInit(){
    this.loadReturnedBooks();
  }
  
  loadReturnedBooks(){
    this.books=[];
    this.spinner.show();
    this.bookService.getReturnedBooks()?.subscribe((response:any) => {
      const observables = response.map((returnedBook: any) =>
      this.fetchBookDetails(returnedBook)
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
  
  fetchBookDetails(returnBook: any) {
    this.books=[];
    return this.bookService.getBookById(returnBook.book)?.pipe(
      map((response:any) => {
        console.log("RES", response);
  
        const bookData = {
          bookDetail: response,
          bookIssueInfo: returnBook,
        };
        console.log("BookData", bookData);
  
        this.books.push(bookData);
      })
    );
  }

}
