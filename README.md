This is a modified version of the original graphql-codegen-react-apollo plugin.

https://github.com/dotansimha/graphql-code-generator/tree/master/packages/plugins/typescript-react-apollo/src

Basic changes:
- works together with or without the typescript-react-apollo plugin
- all HOCs have a custom operationOptions' name property matching the mutation name
- Mutation functions use a non-void return type to help code completion

### Recommended Usage

```typescript
import * as React from "react";
import {compose} from "react-apollo";
import {MyCustomQuery} from "./types.g";

interface Props {
    bar: any
}

class MyComponentClass extends React.Component<Props & MyCustomQuery.Props> {
    public async componentDidMount() {
        const res = await this.props.myCustomQuery({variables: {
            input: {
                foo: 5,
            }
        }})
        
        if (res.data && res.data.myCustomQuery) {
            this.setState({
                bar: res.data.myCustomQuery.bar
            });
        } else {
            // handle error
        };
    }

    public render(): React.ReactNode {
        return <div>{{this.props.bar}}</div>
    }
}

export const MyComponent = compose([
    MyCustomQuery.HOC(),
])(MyComponentClass) as React.Component<Props>;
```

### How about decorators?
It would be great if we could use decorators. Skipping the whole `compose()`-step and manual return type mapping.

Currently this isn't perfectly possible to due a [https://github.com/Microsoft/TypeScript/issues/27883](bug) in typescript
which limits the customizing of return types. Specifically filtering out react props which have been set via injection.

Another minor persistent issue is the decorator's incapability of changing the decorated classes type, which blocks
adding additional properties purely via the decorator thus forcing us to merge the properties in manually 

**Once this is fixed** we hopefully can do something like this:

```typescript
import * as React from "react";
import {compose} from "react-apollo";
import {MyCustomQuery} from "./types.g";

interface Props {
    bar: any
}

@MyCustomQuery.HOC()
export default class MyComponent extends React.Component<Props> {
    public async componentDidMount() {
        const res = await this.props.myCustomQuery({variables: {
            input: {
                foo: 5,
            }
        }});
        
        // ... 
    }

    public render(): React.ReactNode {
        // ...
    }
}
```

Note that we just use the exported class directly without merging our custom
query props into the react components props at all.

Luckily this issue is plagueing several other cool tools such as `react-router` 
and `react-intl` as well, so chances are good for this to be fixed.