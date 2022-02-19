import { NgModule } from '@angular/core';
import {AboutComponent} from './about/about.component';
import {ContentComponent} from './content/content.component';
import {ContactComponent} from './contact/contact.component';
import {AppModule} from '../app.module';


@NgModule({
  declarations: [
    AboutComponent,
    ContentComponent,
    ContactComponent
  ],
  exports: [
    AboutComponent,
    ContentComponent,
    ContactComponent
  ],
  imports: [
    AppModule

  ],
})
export class ProjectModule { }
