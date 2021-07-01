import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    debugger
    if(this.authService.isLoggedIn !== true) {
      if(this.authService.getCurrentUser()!=null){
        this.authService.errorMessage = "Please verify your email address.";
      }
      else{
        this.authService.errorMessage = "Please sign in.";
      }
      this.router.navigate(['auth'])
    }
    return true;
  }
}
