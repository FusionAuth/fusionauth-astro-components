# `@fusionauth/astro-components`

This is a set of components developed by FusionAuth while creating [our docs](https://fusionauth.io)
with [Astro](https://astro.build/).

```mdx
import { RemoteCode, RemoteValue } from '@fusionauth/astro-components';

# This will render a <Code> component with the contents of that file
<RemoteCode lang="javascript" url="https://example.com/file.js"/>

# This will extract the username from the JSON file and display it
You are going to log in as <RemoteValue url="https://example.com/file.json" selector="$.user.username" />.
```

# Installation

Install it via npm:

```shell
$ npm install @fusionauth/astro-components
```

> These components were tested with versions 2, 3 and 4 of Astro.

# Components

## `<RemoteCode>`

Use this to display a `<Code>`
component [to provide syntax highlight](https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting) for
content that is actually hosted somewhere else (e.g. GitHub).

### Usage

```mdx
import { RemoteCode } from '@fusionauth/astro-components';

<RemoteCode lang="json" url="https://example.com/file.json"/>
```

This is equivalent to rendering a `<Code lang="json" code="..." />` with the contents of that JSON file.

### Props

- `url` (required): address with the file to download.
- `lang` (optional): language for the code (default: `plaintext`).
- `title` (optional): title of the section, shown as a piece of text above the block.
- `tags` (optional): tags to extract specific lines from the file.
  See [Lines selection by Tags](#selecting-lines-via-tags).

Any other prop will be forwarded to the underlying `<Code>` component.

### Selecting Lines

This component can retrieve some lines from the remote file according to a custom selection.

#### Selecting Lines via Query String

If you just want to show some specific lines, you can pass an argument to the query string like `#L<start>-L<end>`.

Example:

```mdx
<RemoteCode lang="javascript" url="https://example.com/file.js#L9-L12"/>
```

It will only render lines 9, 10, 11, and 12 from the file.

> Tip: this is the same syntax used by GitHub to mark lines in the UI.

#### Selecting Lines via Tags

If you own the remote file to be injected, you can add a few comments to mark which lines you want to show, and then
pass a `tags="tag-name"` property to the component, which will render lines between `tag::tag-name` and `end::tag-name`.

For instance, if you have the file below:

```javascript
const express = require('express');
const app = express();

// tag::listen
app.listen(3000, () => {
  console.log('App listening on port 3000');
});
// end::listen
```

To render those lines for the `listen` function and its callback, write your code like this.

```mdx
<RemoteCode lang="javascript" url="https://example.com/file.js" tags="listen"/>
```

## `<RemoteValue>`

Instead of hard-coding values from an external file (e.g. some file from the demo app you are writing about), you can
use the `<RemoteValue>` component to render a specific value from that file.

### Usage

A simple usage example for the component (which will cover most cases) is when you have the following JSON file hosted
somewhere (e.g. GitHub) and you are writing a doc that mentions that user.

```json
{
  "user": {
    "email": "richard.hendricks@example.com",
    "username": "richard.hendricks",
    "role": "user"
  }
}
```

Instead of hard-coding the value `richard.hendricks` and taking the risk of your remote file being out-of-sync with your
document, you can use:

```mdx
import { RemoteValue } from '@fusionauth/astro-components';

You are going to log in as <RemoteValue url="https://example.com/file.json" selector="$.user.username" />.
```

This will extract the username from that JSON value and render this instead:

```
You are going to log in as richard.hendricks.
```

> Read more about [Selectors](#Selectors).

### Props

* `url` (required): remote URL to fetch the file from
* `selector` (required): parser-dependent syntax to extract the value from the remote file
* `parser` (optional): value from the `Parser` enum object exported by the component
    * If not defined, the component will use the file extension from the URL
* `defaultValue` (optional): default value if we cannot retrieve the element (otherwise, we'll render "unknown")
    * This is recommended in case you ever change the remote file and the selector doesn't work anymore.

#### Parsers

Currently, we only support JSON files, but the component is ready to support other extensions in the future (e.g. YAML
or XML files), so in the future we could have something like this:

```mdx
import { RemoteValue, RemoteValueParser } from '@fusionauth/astro-components';

<RemoteValue url="https://example.com/file.yaml"
             parser={Parser.YAML}
             selector="some.yaml.selector.in.the.future"
/>
```

#### Selectors

The `selector` can either be a `string` or a `function`.

##### Selector Strings

When using selector strings, you need to check the specific documentation for the parser we use. As we only have JSON right now,
please check [`jsonpath-plus`](https://www.npmjs.com/package/jsonpath-plus), which implements an XPath-based syntax.

##### Selector Functions

When using selector functions, we'll pass the parsed file (e.g. the JSON object) as an argument and the function should return
the value.

##### Selector Examples

These elements will render the same value:

```mdx
<RemoteValue url="https://example.com/file.json"
             selector={(element) => element.users.find(e => e.role === 'user').username}
/>

<RemoteValue url="https://example.com/file.json"
             selector="$.users.[?(@.role === 'user')].username"
/>
```

### Common rendering scenarios

#### Rendering inside custom components

If you need to render a custom component, you can use [`astro`'s way of passing callback as a child](https://docs.astro.build/en/reference/api-reference/#astroslotsrender):

```mdx
<RemoteValue
  url="https://example.com/file.json"
  selector="$.variables.clientId">
  {(value) => <Code lang="shell" code={`CLIENT_ID=${value} some-command`}/>}
</RemoteValue>
```

This is specially useful when you need to fetch several values and render them all in the same component:


```mdx
<RemoteValue
  url="https://example.com/file.json"
  selector="$.variables">
  {(vars) => <Code lang="shell" code={`CLIENT_ID=${vars.clientId} CLIENT_SECRET=${vars.clientSecret} some-command`}/>}
</RemoteValue>
```

#### Rendering inside backticks

Rendering inside inline backticks won't work, but you can use standard `<code>` elements instead.

```mdx
# This won't work
`<RemoteValue url="..."/>`

# Use this instead:
<code><RemoteValue url="..." /></code>
```

## Contributing

Bug reports and pull requests are welcome on GitHub.

## License

This code is available as open source under the terms of the [Apache v2.0 License](https://opensource.org/licenses/Apache-2.0).

## Support

This is created and maintained with love by [FusionAuth](https://fusionauth.io), the customer authentication and
authorization platform that makes developers' lives awesome.

