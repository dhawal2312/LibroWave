import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loading = false;
  loginForm!: FormGroup;
  // Define error messages for each form control
  emailErrorMessage = 'Please enter a valid email address';
  passwordRequiredErrorMessage = 'Password is required';
  passwordLengthErrorMessage = "Password must be atleast 8 characters"

  constructor(private fb:FormBuilder,private auth:AuthService,private router: Router,private toastr: ToastrService){

  }
  ngOnInit(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  
  login(){
    this.loading=true;
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.auth.login(email,password).subscribe((response)=> {
        if(response && response.token){
          this.loading=false;
          localStorage.setItem('token',response.token);
          this.auth.changeAuthentication(true);
          this.router.navigate(['/dashboard'])
        } else{
          this.loading=false;
          console.log(response);
          localStorage.clear();
        }
      },(error)=>{
        this.loading=false;
        const errors = error.error.errors;
        errors.forEach((element:any) => {
          this.toastr.error(element.msg);
        });
      });
    }
  }
}
