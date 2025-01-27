import { Injectable } from '@angular/core';
import { BaseParserService } from './base-parser.service';
import { Dashboard } from '../../interfaces/dataTypes';

@Injectable({
  providedIn: 'root',
})
export class DashboardParserService implements BaseParserService {
  generateHtml(dashboard: Dashboard): string {
    const container = document.createElement('div');

    // Dashboard Title
    const title = document.createElement('h3');
    title.textContent = `${dashboard.label}`;
    container.appendChild(title);

    // Dashboard Information Section

    container.appendChild(this.createHeader(dashboard));

    container.appendChild(this.createDataset(dashboard));

    if (dashboard.visualizations && dashboard.visualizations.length > 0) {
      container.appendChild(this.createVisualizations(dashboard));
    }
    // Permissions Section

    container.appendChild(this.createPermissions(dashboard));

    // Layout Section
    const layoutSection = document.createElement('div');
    layoutSection.classList.add('section');
    const layoutTitle = document.createElement('h4');
    layoutTitle.textContent = 'Layout:';
    layoutSection.appendChild(layoutTitle);

    if (dashboard.layout != undefined) {
      const layoutInfo = document.createElement('p');
      layoutInfo.innerHTML = `<strong>Layout Style:</strong> ${dashboard.layout.style}`;
      layoutSection.appendChild(layoutInfo);
      container.appendChild(layoutSection);
    }

    console.log(container.innerHTML);
    return container.innerHTML;
  }

  private createPermissions(dashboard: Dashboard) {
    const permissionsSection = document.createElement('div');
    permissionsSection.classList.add('section');
    const permissionsTitle = document.createElement('h4');
    permissionsTitle.textContent = 'Permissions:';
    permissionsSection.appendChild(permissionsTitle);

    const permissionsList = document.createElement('ul');
    const permissionsItems = [
      { label: 'Create', value: dashboard.permissions.create ? 'Yes' : 'No' },
      { label: 'Manage', value: dashboard.permissions.manage ? 'Yes' : 'No' },
      { label: 'Modify', value: dashboard.permissions.modify ? 'Yes' : 'No' },
      { label: 'View', value: dashboard.permissions.view ? 'Yes' : 'No' },
    ];

    permissionsItems.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
      permissionsList.appendChild(listItem);
    });
    permissionsSection.appendChild(permissionsList);
    return permissionsSection;
  }
  private createHeader(dashboard: any) {
    const infoSection = document.createElement('div');
    infoSection.classList.add('section');
    const infoTitle = document.createElement('h4');
    infoTitle.textContent = 'Dashboard Information:';
    infoSection.appendChild(infoTitle);

    const infoList = document.createElement('ul');
    const infoItems = [
      { label: 'ID', value: dashboard.id },
      { label: 'Label', value: dashboard.label },
      { label: 'Created by', value: dashboard.createdBy.name },
      {
        label: 'Created on',
        value: new Date(dashboard.createdDate).toLocaleDateString(),
      },
      { label: 'Last Modified by', value: dashboard.lastModifiedBy.name },
      {
        label: 'Last Modified on',
        value: new Date(dashboard.lastModifiedDate).toLocaleDateString(),
      },
    ];

    infoItems.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
      infoList.appendChild(listItem);
    });
    infoSection.appendChild(infoList);
    return infoSection;
  }
  private createVisualizations(dashboard: Dashboard) {
    const visualizationsSection = document.createElement('div');
    visualizationsSection.classList.add('section');
    const visualizationsTitle = document.createElement('h4');
    visualizationsTitle.textContent = 'Visualizations and Steps:';
    visualizationsSection.appendChild(visualizationsTitle);

    dashboard.visualizations.forEach((visualization) => {
      const visualizationTitle = document.createElement('h4');
      visualizationTitle.textContent = visualization.label;
      visualizationsSection.appendChild(visualizationTitle);

      const visualizationType = document.createElement('p');
      visualizationType.innerHTML = `<strong>Type:</strong> ${visualization.type}`;
      visualizationsSection.appendChild(visualizationType);

      const visualizationDescription = document.createElement('p');
      visualizationDescription.innerHTML = `<strong>Description:</strong> ${visualization.description}`;
      visualizationsSection.appendChild(visualizationDescription);
    });
    return visualizationsSection;
  }

  private createDataset(dashboard: Dashboard) {
    // Datasets Section
    const datasetsSection = document.createElement('div');
    datasetsSection.classList.add('section');
    const datasetsTitle = document.createElement('h4');
    datasetsTitle.textContent = 'Datasets Used:';
    datasetsSection.appendChild(datasetsTitle);

    const datasetsList = document.createElement('ul');
    dashboard.datasets.forEach((dataset) => {
      const listItem = document.createElement('li');
      listItem.textContent = dataset.label;
      const ul2 = document.createElement('ul');
      const lis3 = document.createElement('li');
      lis3.innerHTML = `<strong>ID:</strong> ${dataset.id}`;
      ul2.appendChild(lis3);
      const lis4 = document.createElement('li');
      lis4.innerHTML = `<strong>Name:</strong> ${dataset.name}`;
      ul2.appendChild(lis4);
      const lis5 = document.createElement('li');
      lis5.innerHTML = `<strong>URL:</strong> <a href="${dataset.url}" target="_blank">${dataset.url}</a>`;
      ul2.appendChild(lis5);
      listItem.appendChild(ul2);

      datasetsList.appendChild(listItem);
    });

    datasetsSection.appendChild(datasetsList);
    return datasetsSection;
  }
  constructor() {}
}
