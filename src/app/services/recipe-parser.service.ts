import { Injectable } from '@angular/core';
import { DataNode, Dataset, LookupCheckList, RecipeDefinition } from '../../interfaces/dataTypes';
import { BaseParserService } from './base-parser.service';



@Injectable({
  providedIn: 'root'
})
export class RecipeParserService implements BaseParserService {

  constructor() {
    
  }

  parseNodes(recipeDefinition: RecipeDefinition): DataNode[] {
    const parsedNodes: DataNode[] = [];
    for (const [nodeId, nodeData] of Object.entries(recipeDefinition)) {

      let node = this.parseNode(nodeId, nodeData);
      node.id = nodeId;
      parsedNodes.push(node);
    }
    return parsedNodes;
  }

  // Parse an individual node
  private parseNode(nodeId: string, nodeData: DataNode): DataNode {
    const { action, parameters, sources, schema, connectors, label,graph } = nodeData;

    return {
      action,
      label: label ?? '',
      parameters: parameters || {},
      sources: sources || [],
      graph: graph || {},
      connectors: connectors || [],
      ...(schema && { schema }), // Include schema if it exists
    };
  }

  // Generate the flow of the recipe
  getFlow(recipeDefinition: RecipeDefinition): { from: string[]; to: string; action: string }[] {
    const flow: { from: string[]; to: string; action: string }[] = [];
    const visited = new Set<string>();
  
    const findNextNodes = (currentNodeId: string) => {
      for (const [nodeId, nodeData] of Object.entries(recipeDefinition)) {
        if (nodeData.sources && nodeData.sources.includes(currentNodeId) && !visited.has(nodeId)) {
          flow.push({
            from: nodeData.sources,
            to: nodeId,
            action: nodeData.action,
          });
          visited.add(nodeId);
          findNextNodes(nodeId);
        }
      }
    };
  
    // Start with nodes that have no sources (entry points)
    for (const [nodeId, nodeData] of Object.entries(recipeDefinition)) {
      if (!nodeData.sources || nodeData.sources.length === 0) {
        flow.push({
          from: [],
          to: nodeId,
          action: nodeData.action,
        });
        visited.add(nodeId);
        findNextNodes(nodeId);
      }
    }
  
    return flow;
  }

  generateHtml(response: any): string {
    const recipeDefinition = response.recipeDefinition.nodes;
    const labels = response.recipeDefinition.ui.nodes;
    const newNodes = this.parseNodes(labels);
    let parsedNodes = this.parseNodes(recipeDefinition);
    const flow = this.getFlow(recipeDefinition);
    let markdown = ``;
  
    const container = document.createElement("div");


    // Recipe Title
    const title = document.createElement("h3");
    title.textContent = `${response.name}`;
    container.appendChild(title);

  
    container.appendChild(this.createHeader(response));
    const datasets = this.extractUniqueDatasets(parsedNodes);
    container.appendChild(this.createDataSets(datasets))
    // Datasets Section
    let checkList = this.populateCheckList(newNodes);


    // Nodes Section
    const nodesSection = document.createElement("div");
    nodesSection.classList.add("section");
    const nodesTitle = document.createElement("h3");
    nodesTitle.textContent = "Nodes:";
    nodesSection.appendChild(nodesTitle);

    const nodes = this.filterAndGroupNodes(parsedNodes, checkList);

    const ulNodes = document.createElement("ul");
    nodes.forEach(nodeData => {
      const nodeMain = document.createElement("li");
      nodeMain.innerHTML = `<strong>Label:</strong> ${nodeData.label}`;
      const pulNode = document.createElement("ul");
      // Node Details

      if(nodeData.action) {
        pulNode.appendChild(this.createNodeDetails(nodeData));
      }

      if(nodeData.sources && nodeData.sources.length > 0) {
        pulNode.appendChild(this.createSources(nodeData));
      }

      if(nodeData.parameters) {
        pulNode.appendChild(this.createParameters(nodeData));
      }
      if(nodeData.schema) {
        pulNode.appendChild(this.createSchema(nodeData));
      }

      if(nodeData.childNodes && nodeData.childNodes.length > 0) {
        pulNode.appendChild(this.createChildNodes(nodeData));
      }
      nodeMain.appendChild(pulNode);
      nodesSection.appendChild(nodeMain);
      ulNodes.appendChild(nodeMain);
    });
    nodesSection.appendChild(ulNodes);
    container.appendChild(nodesSection);


    return container.innerHTML;
  }

  private createHeader(response: any) {
    const infoSection = document.createElement("div");
    infoSection.classList.add("section");
    const infoItems = [
      { label: "ID", value: response.id },
      { label: "Label", value: response.label },
      { label: "Created by", value: response.createdBy.name },
      { label: "Created on", value: new Date(response.createdDate).toLocaleDateString() },
    ];

    infoItems.forEach(item => {
      const itemMain = document.createElement("p");
      itemMain.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
      infoSection.appendChild(itemMain);
    });

    return infoSection;
  }
  private createDataSets(dataSets: Set<Dataset>){
     // Datasets Section
     const datasetsSection = document.createElement("div");
     datasetsSection.classList.add("section");
     const datasetsTitle = document.createElement("h3");
     datasetsTitle.textContent = "Datasets:";
     datasetsSection.appendChild(datasetsTitle);
   
    
   
     const ul = document.createElement("ul");
     dataSets.forEach(dataset => {
       const datasetMain = document.createElement("li");
       datasetMain.innerHTML = `<strong>Connection Name:</strong> ${dataset.label ?? 'Not Found'} | `;
       if (dataset.sourceObjectName) {
         datasetMain.innerHTML += `<strong>Source Object Name:</strong> ${dataset.sourceObjectName || "Not Found"} | `;
       }
       datasetMain.innerHTML += `<strong>Type:</strong> ${dataset.type}`;
       datasetsSection.appendChild(datasetMain);
       ul.appendChild(datasetMain);
     });
     datasetsSection.appendChild(ul);
    return datasetsSection
  }
  private createChildNodes(nodeData: any) {
    console.log(nodeData);
    const childNodesMain = document.createElement("li");
    childNodesMain.innerHTML = `<strong>Child Nodes:</strong>`;
    const ulChildNodes = document.createElement("ul");
    nodeData.childNodes.forEach((childNode: any) => {
      const childNodeMain = document.createElement("li");
      childNodeMain.innerHTML = `<strong>Labels:</strong> ${childNode.label}`;
      const pulNode = document.createElement("ul");
      if(childNode.sources && childNode.sources.length > 0) {
        pulNode.appendChild(this.createSources(childNode));
      }

      if(childNode.parameters) {
        pulNode.appendChild(this.createParameters(childNode));
      }

      if(childNode.schema) {
        pulNode.appendChild(this.createSchema(childNode));
      }

      childNodeMain.appendChild(pulNode);
      ulChildNodes.appendChild(childNodeMain);
    });
    childNodesMain.appendChild(ulChildNodes);
    return childNodesMain;
  }
  private createSchema(nodeData: any) {
    const schemaMain = document.createElement("li");
    schemaMain.innerHTML = `<strong>Schema:</strong>`;
    const ulSchema = document.createElement("ul");
    if(nodeData.schema) {
      for (const [key, value] of Object.entries(nodeData.schema)) {
        const schemaMain = document.createElement("li");
        if(typeof value === "string"){
          schemaMain.innerHTML = `${key}: "${value}"`;
        } else{
          schemaMain.innerHTML = `${key}: ${JSON.stringify(value)}`;
        
        }
        ulSchema.appendChild(schemaMain);
      }
    }
    schemaMain.appendChild(ulSchema);
    return schemaMain;
  }

  private createNodeDetails(nodeData: any) {
    
    
    const actionli = document.createElement("li");

    actionli.innerHTML = `<strong>Action:</strong> ${nodeData.action}`

    return actionli;
  }
  private createParameters(nodeData: any) {
    const parametersMain = document.createElement("li");
    parametersMain.innerHTML = `<strong>Parameters:</strong>`;
    const ulParameters = document.createElement("ul");
    if(nodeData.parameters) {
      for (const [key, value] of Object.entries(nodeData.parameters)) {
        const parameterMain = document.createElement("li");
        if(typeof value === "string"){
          parameterMain.innerHTML = `${key}: "${value}"`;
        }else{
          parameterMain.innerHTML = `${key}: ${JSON.stringify(value)}`;
        } 
               ulParameters.appendChild(parameterMain);
      }
    }
    parametersMain.appendChild(ulParameters);
    return parametersMain;
  }
  private createSources (nodeData: any ) {
   
      const sourcesMain = document.createElement("li");
      sourcesMain.innerHTML = `<strong>Sources:</strong>`;
      const ulSources = document.createElement("ul");
      nodeData.sources.forEach((source: string | null)=> {
        const sourceMain = document.createElement("li");
        sourceMain.textContent = source;
        ulSources.appendChild(sourceMain);
      });
      sourcesMain.appendChild(ulSources);
      return sourcesMain;
  }

  private extractUniqueDatasets(parsedNodes: DataNode[]) {
    const datasets = new Set<Dataset>();
    for (const nodeData of Object.values(parsedNodes)) {
      if (nodeData.parameters?.dataset) {
        datasets.add(nodeData.parameters.dataset);
      }
    }
    return datasets;
  }

  private filterAndGroupNodes(parsedNodes: DataNode[], checkList: LookupCheckList[]) {
    this.populateNodeIdName(parsedNodes, checkList);

    this.groupChildNodesByParent(parsedNodes, checkList);

    parsedNodes = parsedNodes.filter(node => !node.parent);
    return parsedNodes;
  }

  private groupChildNodesByParent(parsedNodes: DataNode[], checkList: LookupCheckList[]) {
    let nodesWithParents = parsedNodes.filter(node => node.parent);

    nodesWithParents.forEach(node => {
      let parentNode = parsedNodes.find(parent => parent.id === node.parent);
      if (parentNode) {
        if (!parentNode.childNodes) {
          parentNode.childNodes = [];
        }
        parentNode.childNodes.push(node);
      } else if (node.parent) {
        let temp = this.findNode(node.parent, checkList);
        const createdNew = { label: temp.label, id: temp.id } as DataNode;
        createdNew.childNodes = [];
        createdNew.childNodes.push(node);
        parsedNodes.push(createdNew);
      }
    });
  }


  private populateNodeIdName(parsedNodes: DataNode[], checkList: LookupCheckList[]) {
    for (const nodeData of parsedNodes) {
      let name;
      if (nodeData.id) {
        name = this.findNode(nodeData.id, checkList);
        nodeData.label = name.label;
        nodeData.parent = name.parent;
        nodeData.sources.forEach((source) => {
          name = this.findNode(source, checkList);
          if (name) {
            nodeData.sources[nodeData.sources.indexOf(source)] = name.label;
          }
        });
      }

    }
  }

  private populateCheckList(newNodes: DataNode[]) {
    let checkList = new Array<LookupCheckList>();
    newNodes.forEach(nodeData => {
      if (nodeData.label && nodeData.id) {
        checkList.push({ id: nodeData.id, label: nodeData.label });
      }
      if (nodeData.graph) {
        Object.entries(nodeData.graph).forEach(([key, value]: [string, any]) => {
          if (value?.label) {
            checkList.push({ id: key, label: value?.label, parent: nodeData.id });
          } else {
            checkList.push({ id: key, label: key, parent: nodeData.id });
          }
        });
      }
    });
    return checkList;
  }



  private findNode(nodeId: string, nodes: LookupCheckList[]): any {
    return nodes.find(node => node.id === nodeId);
  }

  capitalize(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.substring(1).toLowerCase() : '';
  }
}
