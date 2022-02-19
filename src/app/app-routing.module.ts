import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {Page404Component} from './structure/page-404/page-404.component';
import {AboutComponent} from './project/about/about.component';
import {ContactComponent} from './project/contact/contact.component';
import {ContentComponent} from './project/content/content.component';

const routes: Routes = [

  {
    path: '',
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: ContentComponent, pathMatch: 'full'},
      {path: 'pageNotFound', component: Page404Component},
      {path: 'about', component: AboutComponent},
      {path: 'contact', component: ContactComponent},
      {path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {initialNavigation: 'enabled', useHash: false, anchorScrolling: 'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
