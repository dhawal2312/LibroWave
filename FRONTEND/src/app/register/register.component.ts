import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public loading = false;
  registerForm!: FormGroup;
  nameError = 'Name is required';
  emailErrorMessage = 'Please enter a valid email address';
  passwordRequiredErrorMessage = 'Password is required';
  passwordLengthErrorMessage = "Password must be atleast 8 characters";
  constructor(private fb:FormBuilder, private authService:AuthService,private router: Router,private toastr: ToastrService){

  }
  ngOnInit(){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]] //this.passwordMatchValidator
    });
  }
  
  register(){
    this.loading=true;
    if (this.registerForm.valid) {
      const name= this.registerForm.get('name')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      this.authService.register(name,email,password).subscribe((response:any)=> {
        if(response && response.token){
          this.loading=false;
          localStorage.setItem('token',response.token);
          this.authService.changeAuthentication(true);
          this.toastr.success("You are registered successfully!!!");
          this.router.navigate(['/dashboard'])
        } else{
          this.loading=false;
          this.toastr.error("Registration failed!!!");
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
