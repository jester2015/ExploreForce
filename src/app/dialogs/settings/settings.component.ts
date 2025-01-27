import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AppStorageService } from '../../services/app-storage.service';
import { SalesforceService } from '../../services/salesforce.service';
import { SettingsService } from '../../services/settings.service';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { CodeEditorModule, CodeModel, provideCodeEditor } from '@ngstack/code-editor';

@Component({
  selector: 'app-settings',
  imports: [
    FloatLabelModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    MessageModule,
    TextareaModule,
    CodeEditorModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: [SettingsService, MessageService],
})
export class SettingsComponent {
  value: string = '';
  clientId: string = '';
  clientSecret: string = '';
  instanceUrl: string = '';
  dialogMessage: any;
  showQuickLoad: boolean = false;
quickLoadValue: string = '';


  saveSettings() {

    if(this.showQuickLoad) {
      let json = JSON.parse(this.model.value);
      this.clientId = json.clientId ?? '';
      this.clientSecret = json.clientSecret?? '';
      this.instanceUrl = json.url?? '';
    }
    this.settingsService.clientId = this.clientId;
    this.settingsService.clientSecret = this.clientSecret;
    this.settingsService.salesforceUrl = this.instanceUrl;
  }
  quickLoad() {
    this.showQuickLoad = !this.showQuickLoad
    if(this.showQuickLoad){
      this.generateSettingsJson();
    }
    
  }

  private generateSettingsJson() {

    let json = {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      url: this.instanceUrl
    }
  
    this.model.value = JSON.stringify(json, null, 2);
  }

  tryConnection() {
    this.saveSettings();
    this.salesforceService.loginIfNeeded().subscribe({
      next: (response) => {
        this.dialogMessage = 'Successfully logged';
        this.settingsService.accessToken = response.access_token;
        this.ref.close();
      },
      error: (error) => {
        this.dialogMessage = error;
      },
    });
  }

  constructor(
    private readonly appStorage: AppStorageService,
    private readonly salesforceService: SalesforceService,
    private settingsService: SettingsService,
    private readonly messageService: MessageService,
    public ref: DynamicDialogRef
  ) {
    this.clientId = this.settingsService.clientId;
    this.clientSecret = this.settingsService.clientSecret;
    this.instanceUrl = this.settingsService.salesforceUrl;
  }


  theme = 'vs-dark';

  model: CodeModel = {
    language: 'json',
    uri: 'main.json',
    value: '{"clientId": "", "clientSecret": "", "url": ""}'
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
      showSlider: true,
      showNumbers: true,
      showDecorations: true,
    }
  };

  onCodeChanged(main: string, value: string) {
    console.log('CODE', value);
  }
}
