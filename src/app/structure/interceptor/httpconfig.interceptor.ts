import {Injectable} from '@angular/core';


import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError, TimeoutError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../service/common.service';
import {BaseService} from '../service/base.service';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  token: string = '';
  language: any;

  constructor(private baseService: BaseService,
              private commonService: CommonService,
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    // @ts-ignore
    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (parseInt(event.status.toString(), 10) === 200) {
            return event;
          }
        }
      }
      ),
      catchError((error: HttpErrorResponse) => {
        /*switch (error.status) {
          case 400 : {
            this.commonService.showErrorMessage(this.translate.instant('BADREQUESTMESSAGE').toString(),
              error.status.toString());
            break;
          }
          case 401 : {
            if (!(error.url.match('logout') || error.url.match('user'))) {
              this.commonService.showErrorMessage(this.translate.instant('UNAUTHORIZEMESSAGE').toString(), error.status.toString());
            }
            break;
          }
          case 403 : {
            this.commonService.showErrorMessage(this.translate.instant('forbidenMessage').toString(),
              error.status.toString());
            break;
          }
          case 404 : {
            if (error.url.match('logout')) {
              console.error('logout');
            } else {
              this.commonService.showErrorMessage(this.translate.instant('notFoundMessage').toString(),
                error.status.toString());
            }
            break;
          }
          case 500 : {
            this.commonService.showErrorMessage(this.translate.instant('internalServerMessage').toString(),
              error.status.toString());
            break;
          }
          case 503 : {
            this.commonService.showErrorMessage(this.translate.instant('methodNotAllowedMessage').toString(), error.status.toString());
            break;
          }
          case 555 : {
            this.commonService.showErrorMessage(error.error.message.desc, error.status.toString());
            break;
          }
          case 0 : {

            this.commonService.showErrorMessage(this.translate.instant('internalServerMessage').toString(), null);

            break;
          }

          default : {

            break;
          }
        }*/
        return throwError(error);
      }));
  }
}
