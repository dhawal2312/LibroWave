import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book/book.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent {
  constructor(private userService:UserService,private route: ActivatedRoute,private bookService:BookService,private toastr: ToastrService,private spinner: NgxSpinnerService){}
  bookId: string | null=null;
  public bookData:any;


  ngOnInit() {
    // Subscribe to route parameter changes

    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('bookId');
      console.log('Book ID:', this.bookId);
    });
    this.loadBookbyId();
    
  }

  loadBookbyId(){
    this.spinner.show();
    if(this.bookId){ 
      this.bookService.getBookById(this.bookId)?.subscribe((response:any)=>{
        this.spinner.hide();
        console.log("Book Data",response)
        this.bookData=response;
      },(error)=>{
        this.spinner.hide();
        const errors = error.error.errors;
        errors.forEach((element:any) => {
          this.toastr.error(element.msg);
        });
      });
    
  }
  }
  issueBook(){
    if(this.bookId){
      this.userService.issueBook(this.bookId)?.subscribe((response:any) => {
        console.log(response);
        this.loadBookbyId();
        this.toastr.success(response.msg);
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
}
