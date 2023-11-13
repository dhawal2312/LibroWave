import { inject } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';


export const preventLandingAccessGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if(token){
    return inject(Router).createUrlTree(['/dashboard']);
    
  }
  return true;
};

export const preventDashboardAccessGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if(!token){
    return inject(Router).createUrlTree(['/landing']);
    
  }
  return true;
};



// export const adminGuard: CanActivateFn = (route, state) => {
//   return true;
// };
