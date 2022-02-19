import {Injectable, isDevMode} from '@angular/core';
import {finalize, map} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {WindowService} from './window.service';
import {HttpClient} from '@angular/common/http';
import {CookieService} from './cookie.service';
import {CommonService} from '../service/common.service';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {any} from 'codelyzer/util/function';

@Injectable(
  {
    providedIn: 'root',
  }
)
export class AuthService {
  private confUrl: string;
  public isShowTicketDialog: boolean = false;
  // client properties
  private clientId: string;
  private clientScope: string;
  // user properties
  private principalInfo: any = {};
  private userName: string = '';
  private firstName: string = '';
  private lastName: string = '';
  private jalaliDate: string = '';
  private authenticated: boolean = false;
  private roleList: string[];
  // url properties
  private authenticationServerUrl: string;
  private oAuthLogoutUrl: string;
  private sabaUrl: string;
  private atabatUrl: string;
  private oAuthCallbackUrl: string;
  private oAuthUserUrl: string;
  private oAuthTokenUrl: string;
  private resourceUrl: string;
  private authorizeUrl: string;
  private authorizationUrl: string;
  private configUrls: object;
  // other properties
  private token: string;
  private href: string;
  private expires: any = 0;
  private subject = new Subject<any>();
  private subjectPrincipal = new Subject<any>();
  private subjectExpires = new Subject<any>();

  public requestData: any = {};
  isCallGetSessionTimeout: boolean = false;

  constructor(
    private location: Location,
    private windows: WindowService,
    private http: HttpClient,
    private cookieService: CookieService,
    private commonService: CommonService,
    private router: Router) {
  }

  getToken() {
    return this.token;
  }

  isAuthenticated(): Observable<boolean> {
    return of(this.authenticated);
  }


  getUserName() {
    return this.userName;
  }

  getPrincipalInfo(): Observable<any> {
    return this.subjectPrincipal.asObservable();
  }

  getName() {
    return this.firstName + ' ' + this.lastName;
  }

  getExpires(): Observable<any> {
    return this.subjectExpires.asObservable();
  }
  getResourceUrl(url?) {
    if (url === undefined || url == null || url === '') {
      return this.resourceUrl;
    } else {
      return this.configUrls[url];
    }
  }

  getAuthorizationUrl() {
    return this.authorizationUrl;
  }

  private startExpiresTimer(seconds: number) {
    // if (this.expiresTimerId != null) {
    //   clearTimeout(this.expiresTimerId);
    // }
    // this.expiresTimerId = setTimeout(() => {
    //   console.log('Session has expired');
    //   this.logout();
    // }, seconds * 1000); // seconds * 1000
    // console.log('Token expiration timer set for', seconds, "seconds");
  }

  getResource() {
    this.confUrl = (isDevMode() ? 'assets/config/dev.conf.json' : 'assets/config/prod.conf.json');
    this.http.get(this.confUrl)
      .pipe(map(res => res))
      .subscribe((config): any => {
        this.resourceUrl = config['resourceUrl'];
        this.configUrls = config;
        this.oAuthTokenUrl = this.authenticationServerUrl + '/oauth/authorize?redirect_uri=' + this.oAuthCallbackUrl +
          '&response_type=token&client_id=' + this.clientId + '&scope=' + this.clientScope;
        this.subject.next({config});
      }, err => {
        console.error('config file not found : ', err);
      });
  }

  getUser(isError?: boolean) {
    if (!isDevMode() || (this.token != null)) {
      this.http.get(this.oAuthUserUrl).subscribe(info => {
          this.principalInfo = info;
          // this.userName = info.name;
          // this.firstName = info.principal.firstName;
          // this.lastName = info.principal.lastName;
          // const authorities = info.authorities;
          this.authenticated = true;
          if (!isError) {
            this.router.navigate([window.location.hash.toString().substring(1, window.location.hash.length)]);
          }
          this.subjectPrincipal.next({principalInfo: this.principalInfo});
          this.router.navigate(['/home']);
        }, err => {
          console.log('Failed to fe tch user info:' + err);
          this.windows.createWindow('login');
        }
      );
    }
  }

  getUserWithOutRedirect() {
    if (!isDevMode() || (this.token != null)) {
      this.http.get(this.oAuthUserUrl).subscribe((info):any => {
          this.principalInfo = info;
          this.userName = info['name'];
          this.firstName = info['principal'].firstName;
          this.lastName = info['principal'].lastName;
          const authorities = info['authorities'];
          this.authenticated = true;
          this.subjectPrincipal.next({principalInfo: this.principalInfo});
        }, err => {
          console.log('Failed to fe tch user info:' + err);
        }
      );
    }
  }


  getDateTime() {
    return this.http.post(this.getAuthorizationUrl() + '/globalController/getServerDateTime', {});
  }

  getCurrentDate() {
    return this.jalaliDate;
  }

  getMenuList(): Observable<any> {
    return this.subject.asObservable();
  }

  getResourceUrlList(): Observable<any> {
    return this.subject.asObservable();
  }

  logout() {
    this.http.post(this.oAuthLogoutUrl, {}, {withCredentials: true}).pipe(finalize(() => {
      this.authenticated = false;
      this.token = null;
      this.expires = null;
      if (!isDevMode()) {
        this.http.post('logout', {},)
          .subscribe(() => {
            window.location.reload();
          }, err => {
            window.location.reload();
          });
      }
      window.location.reload();
    })).subscribe();
  }
  set setIsShowTicketDialog(isShow: boolean) {
    this.isShowTicketDialog = isShow;
  }

  get getIsShowTicketDialog(): boolean {
    return this.isShowTicketDialog;
  }

  set setHeaderRequestData(data) {
    this.requestData = data;
  }

  get getRequestData() {
    return this.requestData;
  }
}
