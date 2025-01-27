import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalesforceService } from './services/salesforce.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule } from "@angular/forms";
import { RecipeParserService } from './services/recipe-parser.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import {MarkdownModule, MarkdownService} from 'ngx-markdown';
import { AppStorageService } from './services/app-storage.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,MatAutocompleteModule, FormsModule,AutoCompleteModule, MarkdownModule,ToastModule


   ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private readonly salesforceService: SalesforceService, private readonly recipeParserService: RecipeParserService, private readonly markDownService: MarkdownService,
    appStorageService : AppStorageService
  ) {}

  title = 'sf-recipe-documenter';
  ngOnInit() {
     

     
  }

  


}
