declare module '*.handlebars' {
  const content: (context: any, execOptions?: any) => string;
  export = content;
}
