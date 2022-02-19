import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, NavigationStart, Router,
  RouterStateSnapshot
} from '@angular/router';
import {Observable, of, pipe} from 'rxjs';
import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {AuthService} from './structure/auth/auth.service';
import {map, catchError} from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router, private location: Location) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authService.isAuthenticated().pipe(map(e => {
      if (e) {
        return true;
      } else {
        this.router.navigate(['/401']);
        return false;
      }
    }), catchError(() => {
      this.router.navigate(['/home']);
      return of(false);
    }));
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
