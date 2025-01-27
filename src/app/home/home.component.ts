import { Component } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { AppStorageService } from '../services/app-storage.service';
import { SalesforceService } from '../services/salesforce.service';
import { RecipeParserService } from '../services/recipe-parser.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { SettingsComponent } from '../dialogs/settings/settings.component';
import { SettingsService } from '../services/settings.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { FileService } from '../services/file.service';
import { DashboardParserService } from '../services/dashboard-parser.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StringFunctions } from '../string-functions';


@Component({
  selector: 'app-home',
  imports: [
    MatAutocompleteModule,
    FormsModule,
    AutoCompleteModule,
    MarkdownModule,
    SplitButtonModule,
    ProgressSpinnerModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    ButtonModule,
    SelectButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [MessageService, DialogService, ConfirmationService],
})
export class HomeComponent {
  loadConfig($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private readonly salesforceService: SalesforceService,
    private readonly recipeParserService: RecipeParserService,
    private readonly markDownService: MarkdownService,
    private readonly appStorageService: AppStorageService,
    private readonly messageService: MessageService,
    private readonly settingsService: SettingsService,
    private readonly dashboardParserService: DashboardParserService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly fileService: FileService,
    private readonly stringFunctions: StringFunctions
  ) {
    this.items = [
      { label: 'Load Last Recipe', command: () => this.loadLastRecipe() },
      {
        label: 'Download Markdown File',
        command: () => this.generateMarkdown(),
      },
      {
        label: 'Download Json File',
        command: () => this.getRecipeJsonFile(this.selectedRecipe.id),
      },
      { label: 'Settings', command: () => this.showSettings() },
    ];
  }
  currentSelection = 'Recipe';
  currentObjectString = `Select a ${this.currentSelection}`;

  stateOptions: any[] = [
    { label: 'Recipe', value: 'recipe' },
    { label: 'Dashboard', value: 'dashboard' },
  ];

  value: string = 'recipe';

  changeState(event: any) {
    if (event.originalEvent.checked) {
      this.switchCurrentObject();
      console.log(event);
    }
  }
  clearConfig(event: Event): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear the configuration?',
      header: 'Confirmation',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      closable: true,
      closeOnEscape: true,
      accept: () => {
        this.settingsService.clearSettings();
        this.jsonRecipe = '';
        this.markdown = '';
        this.fullList = [];
        this.selectedRecipe = { id: '', label: '' };
        this.messageService.add({severity:'info', summary:'Config Cleared', detail:'All configuration has been cleared'});
      },
      reject: () => {
         this.messageService.add({severity:'info', summary:'Cancelled', detail:'Configuration clear cancelled'});
      },
    });
  }

  switchCurrentObject() {
    this.fullList = [];
    this.recipeSelectList = [];
    this.selectedRecipe = { id: '', label: '' };
    this.jsonRecipe = '';

    this.settingsService.reportObject = this.value;
    if (this.currentIsRecipes()) {
      this.getListofRecipes();
    } else {
      this.getListOfDashBoards();
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Loading ' + this.stringFunctions.capitalizeFirstLetter(this.value) + 's',
      life: 3000,
    });
  }

  getListOfDashBoards() {
    this.loading = true;
    this.salesforceService
      .callCustomEndpoint('wave/dashboards?pageSize=200')
      .subscribe({
        next: (response) => {
          console.log('Custom endpoint response:', response);
          this.buildSelectList(response.dashboards);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Receiving Recipes',
            life: 3000,
          });
          console.error('Error calling custom endpoint', error);

          this.loading = false;
        },
        complete: () => (this.loading = false),
      });
  }

  getSpecificDashboard(itemId: string) {
    this.loading = true;
    this.jsonRecipe = '';
    this.salesforceService
      .callCustomEndpoint(`wave/dashboards/${itemId}`)
      .subscribe({
        next: (response) => {
          localStorage.setItem('recipe', JSON.stringify(response));
          console.log('Custom endpoint response:', response);
          this.getHtml(response);
        },
        error: (error) => {
          console.error('Error calling custom endpoint', error);
        },
        complete: () => (this.loading = false),
      });
  }

  showSettings() {
    this.ref = this.dialogService.open(SettingsComponent, {
      header: 'Settings',
      width: '50%',
    });
    this.ref.onClose.subscribe((result: any) => {
      this.loadCurrentOption();
    });
  }
  loadLastRecipe() {
    let lastRecipe = this.appStorageService.getItem('recipe');
    lastRecipe != null
      ? this.getHtml(JSON.parse(lastRecipe))
      : console.log('No recipe found');
  }

  ngOnInit() {
    this.value  = this.settingsService.reportObject
    this.salesforceService.loginIfNeeded().subscribe((response) => {
      this.salesforceService.setAccessToken(
        response.access_token,
        response.instance_url
      );
      

      this.loadCurrentOption();
    });
  }


  loadCurrentOption(){
    if(this.currentIsRecipes()){
      this.getListofRecipes();
    }else {
      this.getListOfDashBoards();
    }
  }

  generateMarkdown() {}
  searchRecipes($event: AutoCompleteCompleteEvent) {
    this.recipeSelectList = this.fullList.filter((recipe) =>
      recipe.label.toLowerCase().includes($event.query.toLowerCase())
    );
  }
  title = 'sf-recipe-documenter';
  showFiller = false;
  jsonRecipe = '';
  recipeId = '';
  recipeSelectList = [] as { id: string; label: string }[];
  fullList = [] as { id: string; label: string }[];
  selectedRecipe = {} as { id: string; label: string };
  markdown = '';
  loading = false;
  items: MenuItem[] = [] as MenuItem[];
  ref: DynamicDialogRef | undefined;

  selectRecipe($event: AutoCompleteSelectEvent) {
    if (this.currentIsRecipes()) {
      this.getSpecificRecipe(this.selectedRecipe.id);
    } else {
      console.log('Selected Dashboard:', this.selectedRecipe);
      this.getSpecificDashboard(this.selectedRecipe.id);
    }
  }

  lookupRecipe() {
    this.recipeId = this.selectedRecipe.id;
    this.getSpecificRecipe(this.recipeId);
  }

  buildSelectList(recipes: any[]) {
    let recipeOption = [];
    recipes.forEach((recipe) => {
      recipeOption.push({ id: recipe.id, label: recipe.name });
      this.recipeSelectList = recipeOption;
      this.fullList = recipeOption;
    });
  }

  currentIsRecipes() {
    return this.value === 'recipe';
  }

  getListofRecipes() {
    this.loading = true;
    this.salesforceService
      .callCustomEndpoint('wave/recipes?pageSize=200')
      .subscribe({
        next: (response) => {
          console.log('Custom endpoint response:', response);
          this.buildSelectList(response.recipes);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Receiving Recipes',
            life: 3000,
          });
          console.error('Error calling custom endpoint', error);

          this.loading = false;
        },
        complete: () => (this.loading = false),
      });
  }

  genRecLogin() {
    this.getListofRecipes();
  }
  async getSpecificRecipe(recipeId: string) {
    this.loading = true;
    this.jsonRecipe = '';
    this.salesforceService
      .callCustomEndpoint(`wave/recipes/${recipeId}?format=R3`)
      .subscribe({
        next: (response) => {
          localStorage.setItem('recipe', JSON.stringify(response));
          this.getHtml(response);
        },
        error: (error) => {
          console.error('Error calling custom endpoint', error);
        },
        complete: () => (this.loading = false),
      });
  }

  async getRecipeJsonFile(recipeId: string) {
    this.loading = true;
    this.salesforceService
      .callCustomEndpoint(`wave/recipes/${recipeId}/file`)
      .subscribe({
        next: (response) => {
          this.fileService.downloadFile(
            JSON.stringify(response),
            this.selectedRecipe.label + '_Definition.json'
          );
        },
        error: (error) => {
          console.error('Error calling custom endpoint', error);
        },
        complete: () => (this.loading = false),
      });
  }

  getClipboard() {
    this.markDownService.parse;
    navigator.clipboard.writeText(this.markdown);
  }
  async getHtml(recipe: any) {
    if (this.currentIsRecipes()) {
      this.markdown = this.recipeParserService.generateHtml(recipe);
    } else {
      this.markdown = this.dashboardParserService.generateHtml(recipe);
    }

    this.jsonRecipe = this.markdown;
  }

  show() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Message Content',
      life: 3000,
    });
  }
}
