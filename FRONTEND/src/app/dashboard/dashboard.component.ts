import { Component } from '@angular/core';
import { BookService } from '../services/book/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public books:any;
  constructor(private bookService:BookService){

  }
  ngOnInit(){
    this.bookService.getAllBooks()?.subscribe((response:any) => {
      this.books=response;
      console.log(this.books);
      
    })
  }
}
