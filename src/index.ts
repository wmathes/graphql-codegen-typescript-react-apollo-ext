import { GraphQLSchema } from 'graphql';
import { DocumentFile, PluginFunction, PluginValidateFn, transformDocumentsFiles } from 'graphql-codegen-core';
import { flattenTypes } from 'graphql-codegen-plugin-helpers';
import { initCommonTemplate, TypeScriptCommonConfig } from 'graphql-codegen-typescript-common';
import * as Handlebars from 'handlebars';
import { extname } from 'path';
import { generateFragments, gql, propsType } from './helpers';
import './polyfills';
import * as rootTemplate from './root.handlebars';

export interface Config extends TypeScriptCommonConfig {
  noGraphqlTag?: boolean;
  noNamespaces?: boolean;
  noHOC?: boolean;
}

export const plugin: PluginFunction<Config> = async (
  schema: GraphQLSchema,
  documents: DocumentFile[],
  config: Config
): Promise<string> => {
  const { templateContext, convert } = initCommonTemplate(Handlebars, schema, config);
  const transformedDocuments = transformDocumentsFiles(schema, documents);
  const flattenDocuments = flattenTypes(transformedDocuments);
  Handlebars.registerHelper('generateFragments', generateFragments(convert));
  Handlebars.registerHelper('gql', gql(convert));
  Handlebars.registerHelper('propsType', propsType(convert));

  const hbsContext = {
    ...templateContext,
    ...flattenDocuments
  };

  return Handlebars.compile(rootTemplate)(hbsContext);
};

export const validate: PluginValidateFn<any> = async (
  schema: GraphQLSchema,
  documents: DocumentFile[],
  config: any,
  outputFile: string
) => {
  if (extname(outputFile) !== '.tsx') {
    throw new Error(`Plugin requires extension to be ".tsx"!`);
  }
};
