import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppStorageService } from './app-storage.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class SalesforceService {
  private accessToken= '';
  private instanceUrl= '';

  constructor(private readonly http: HttpClient, private readonly appStorage: AppStorageService,
     private readonly settingsService: SettingsService) {}

  loginIfNeeded() {    
  return this.getAccessToken(this.settingsService.clientId, this.settingsService.clientSecret);
  }

  getAccessToken(clientId: string, clientSecret: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);

    return this.http.post('/services/oauth2/token', body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  setAccessToken(token: string, instanceUrl: string) {
    this.accessToken = token;
    this.settingsService.accessToken = token;
  }

  callCustomEndpoint(endpoint: string, method: string = 'GET', body: any = null): Observable<any> {
    const url = `/services/data/v60.0/${endpoint}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.settingsService.accessToken}`);

    
    if (method === 'GET') {
      return this.http.get(url, { headers });
    } else if (method === 'POST') {
      return this.http.post(url, body, { headers });
    } else if (method === 'PUT') {
      return this.http.put(url, body, { headers });
    } else if (method === 'DELETE') {
      return this.http.delete(url, { headers });
    } else {
      throw new Error('Unsupported HTTP method');
    }
  }
}