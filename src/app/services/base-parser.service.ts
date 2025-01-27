import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseParserService {

  constructor() { }

  generateHtml(object: object): string {
    return '';
  }
}
