import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  constructor() { }
    

    getItem(key: string): string | null {
      return window.localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
      window.localStorage.setItem(key, value);
    }
  
}
