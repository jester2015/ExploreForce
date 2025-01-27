import { Injectable } from '@angular/core';
import { AppStorageService } from './app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private appStorage: AppStorageService) { }

  private clientIdKey: string = 'clientId';
  private clientSecretKey: string = 'clientSecret';
  private salesforceUrlKey: string = 'salesforceUrl';
  private accessTokenKey: string = 'accessToken';
  private apiVersionKey: string = 'apiVersion';
  private reportObjectKey: string = 'reportObject';





  
  public get reportObject() : string {
    return this.appStorage.getItem('reportObject') as string;
  }
  public set reportObject(v : string) {
    this.appStorage.setItem(this.reportObjectKey, v);
  }
  
 
  public get clientId() : string {
   return this.appStorage.getItem(this.clientIdKey) as string;
  }
  public set clientId(v : string) {
    this.appStorage.setItem(this.clientIdKey, v);
  }
  
  public get clientSecret() : string {
    return this.appStorage.getItem(this.clientSecretKey) as string;
  }
  public set clientSecret(v : string) {
      this.appStorage.setItem(this.clientSecretKey, v);
  }
  
  
  public get salesforceUrl() : string {
   return this.appStorage.getItem(this.salesforceUrlKey) as string;
  }
  public set salesforceUrl(v : string) {
    this.appStorage.setItem(this.salesforceUrlKey, v);
  }

  
    public get accessToken() : string {
    return this.appStorage.getItem(this.accessTokenKey) as string
  }
    public set accessToken(v : string) {
    this.appStorage.setItem(this.accessTokenKey, v);
  }
  
  public clearSettings() : void {
    this.appStorage.setItem(this.clientIdKey, '');
    this.appStorage.setItem(this.clientSecretKey, '');
    this.appStorage.setItem(this.salesforceUrlKey, '');
    this.appStorage.setItem(this.accessTokenKey, '');
  }

  


}
