import { Injectable } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';

@Injectable()
export class BreadcrumbService {

    private itemsSource = new Subject();

    itemsHandler = this.itemsSource.asObservable();

    setItems(items: any[]) {
        this.itemsSource.next(items);
    }
}
