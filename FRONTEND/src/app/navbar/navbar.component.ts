import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public isAuthenticated = false;
  public userName = "";
  constructor(private router: Router,private auth:AuthService, private userService:UserService){
    this.auth.isAuthenticated.subscribe((value)=>{

      this.isAuthenticated=value;
      if(this.isAuthenticated===true){
        this.getUserDetails();
      }
      console.log(this.isAuthenticated);
    });
    console.log("aa");
    const token = localStorage.getItem('token');
    console.log(token);
    if(token){
      this.auth.changeAuthentication(true);
    }
    else{
      this.auth.changeAuthentication(false);
    }
  }
  
  logout(){
    console.log("called");
    localStorage.removeItem('token');
    this.auth.changeAuthentication(false);
    this.router.navigate(['/landing'])
  }

  getUserDetails(){
    console.log("getuser");
    this.userService.getUserDetails()?.subscribe((response:any) => {
      this.userName = response.name;
    })
  }
}
