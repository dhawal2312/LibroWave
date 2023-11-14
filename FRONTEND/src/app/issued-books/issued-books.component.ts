import { Component } from '@angular/core';
import { BookService } from '../services/book/book.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-issued-books',
  templateUrl: './issued-books.component.html',
  styleUrls: ['./issued-books.component.css']
})
export class IssuedBooksComponent {
  public books:any =[];
  public issuedBooksData:any;
  constructor(private bookService:BookService,private toastr: ToastrService,private spinner: NgxSpinnerService){
  }
  ngOnInit(){
    this.getIssuedBooks();
    
  }
  getIssuedBooks(){
    this.spinner.show();
    this.bookService.getIssuedBooks()?.subscribe((response:any) => {
      const observables = response.map((issuedBook: any) =>
      this.fetchBookDetails(issuedBook)
    );

    forkJoin(observables).subscribe(() => {
      this.spinner.hide();
      console.log("Book Info =", this.books);
    });


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
    console.log("ABC", issuedBook);
  
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
}
