This is a modified version of the original graphql-codegen-react-apollo plugin.

https://github.com/dotansimha/graphql-code-generator/tree/master/packages/plugins/typescript-react-apollo/src

Basic changes:
- works together with or without the typescript-react-apollo plugin
- all HOCs have a custom operationOptions' name property matching the mutation name