import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor() {
    if (localStorage.getItem('language')) {
      this.setLanguage(localStorage.getItem('language')!);
    } else {
      this.setLanguage('en-US');
    }
  }

  setLanguage(data: string): void {
    this.languageSubject.next(data);
  }

  getLanguage(): Observable<string> {
    return this.languageSubject.asObservable();
  }
}
