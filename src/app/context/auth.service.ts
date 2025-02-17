import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthContextService {
  private userSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);
  public user$: Observable<any | null> = this.userSubject.asObservable();
  public loading: boolean = true;

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
    this.loading = false;
  }

  login(userData: any): void {
    this.userSubject.next(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  getUser(): any {
    return this.userSubject.value;
  }
}
