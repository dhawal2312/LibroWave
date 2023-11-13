import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent {
  constructor(private route: ActivatedRoute,private bookService:BookService){}
  bookId: string | null=null;
  public bookData:any;


  ngOnInit() {
    // Subscribe to route parameter changes

    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('bookId');
      console.log('Book ID:', this.bookId);
    });
    if(this.bookId){ 
        this.bookService.getBookById(this.bookId)?.subscribe((response:any)=>{
          console.log("Book Data",response)
          this.bookData=response;
        })
      
    }
    
  }
}
