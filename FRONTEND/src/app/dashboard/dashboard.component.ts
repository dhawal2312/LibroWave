import { Component } from '@angular/core';
import { BookService } from '../services/book/book.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public books:any;
  public loading=false;
  constructor(private bookService:BookService,private toastr: ToastrService,private spinner: NgxSpinnerService){


  }
  ngOnInit(){
    this.loadAllbooks();
  }

  loadAllbooks(){
      this.spinner.show();

      this.bookService.getAllBooks()?.subscribe((response:any) => {
        this.spinner.hide();
        this.books=response;
        console.log(this.books);
      },(error)=>{
        this.spinner.hide();
        const errors = error.error.errors;
        errors.forEach((element:any) => {
          this.toastr.error(element.msg);
        });
      })
    
  }
}
