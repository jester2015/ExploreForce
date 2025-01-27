// Type definitions
export  interface Dataset {
  connectionName: string;
  label: string;
  sourceObjectName: string;
  type: string;
}

export  interface SampleDetails {
  sortBy: string[];
  type: string;
}

export  interface DataParameters {
  dataset?: Dataset;
  fields?: Fields[];
  sampleDetails?: SampleDetails;
  joinType?: string;
  leftKeys?: string[];
  rightKeys?: string[];
  rightQualifier?: string;
  filterExpressions?: Record<string, unknown>[];
  measuresToCurrencies?: unknown[];
}

export  interface Fields {
  name: string;
  type: string;
  mode: string;
}

export  interface Schema {
  fields: string[];
  slice?: {
    fields: string[];
    ignoreMissingFields: boolean;
    mode: string;
  };
}

export interface DataNode {
  action: string;
  parameters?: DataParameters;
  sources: string[];
  schema?: Schema;
  label?: string;
  connectorSet? : string[]
  connectors?: Connectors[];
  id?: string;
  parent?: string;
  childNodes?: DataNode[];
  graph?: any;
}

export  interface Connectors {
  source: string;
  target: string;

}

export interface RecipeDefinition {
  [key: string]: DataNode;
}

export interface LookupCheckList {
  id: string;
  label: string;
  parent?: string;
}

export interface Save {
  id: string;
  label: Node[];
  parent?: string;
}

export interface Dashboard {
  id: string;
  label: string;
  createdBy: { name: string };
  createdDate: string;
  lastModifiedBy: { name: string };
  lastModifiedDate: string;
  folder: { label: string; name: string; url: string };
  assetSharingUrl: string;
  datasets: { id: string; label: string; name: string; url: string }[];
  filePreview: { url: string };
  permissions: { create: boolean; manage: boolean; modify: boolean; view: boolean };
  refreshDate: string;
  layout: { style: string };
  visualizations: { type: string; label: string; description: string }[];
}