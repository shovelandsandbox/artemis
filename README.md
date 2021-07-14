[tests]: https://img.shields.io/circleci/project/github/shovelandsandbox/artemis.svg
[tests-url]: https://circleci.com/gh/shovelandsandbox/artemis
[cover]: https://codecov.io/gh/shovelandsandbox/artemis/branch/main/graph/badge.svg
[cover-url]: https://codecov.io/gh/shovelandsandbox/artemis
[size]: https://packagephobia.now.sh/badge?p=artemis
[size-url]: https://packagephobia.now.sh/result?p=artemis

<div align="center">
	<img src='https://user-images.githubusercontent.com/841294/53402609-b97a2180-39ba-11e9-8100-812bab86357c.png' height='100' alt='Apollo Server'><br/><br/>
</div>

[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]

# Artemis

A logging plugin for Apollo GraphQL Server

:heart: Please consider [Sponsoring our work](https://github.com/sponsors/shovelandsandbox)

This module provides uniform logging for the entire GraphQL request lifecycle, as provided by plugin hooks in `apollo-server`. The console/terminal result of which will resemble the image below:

<img src="https://github.com/shellscape/apollo-log/raw/master/.github/screen.png" width="508">

## Requirements

`artemis` is an [evergreen 🌲](./.github/FAQ.md#what-does-evergreen-mean) module.

This module requires an [Active LTS](https://github.com/nodejs/Release) Node version (v10.23.1+).

## Install

Using npm:

```console
npm install @shovelandsandbox/artemis
```

## Usage

Setting up `artemis` is straight-forward. Import and call the plugin function, passing any desired options, and pass the plugin in an array to `apollo-server`.

```js
import { ArtemisLoggingPlugin } from '@shovelandsandbox/artemis';
import { ApolloServer } from 'apollo-server';

const options = { ... };
const plugins = [ArtemisLoggingPlugin(options)];
const apollo = new ApolloServer({
  plugins,
  ...
});
```

Please see the [Apollo Plugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#installing-a-plugin) documentation for more information.

## Options

### `events`

Type: `Record<string, boolean>`<br>
Default:

```js
{
  didEncounterErrors: true,
  didResolveOperation: false,
  executionDidStart: false,
  parsingDidStart: false,
  responseForOperation: false,
  validationDidStart: false,
  willSendResponse: true
}

```

Specifies which [Apollo lifecycle events](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#apollo-server-event-reference) will be logged. The `requestDidStart` event is always logged, and by default `didEncounterErrors` and `willSendResponse` are logged.

### `mutate`

Type: `Function`
Default: `(data: Record<string, string>) => Record<string, string>`

If specified, allows inspecting and mutating the data logged to the console for each message.

#### `prefix`

Type: `String`<br>
Default: `apollo`

Specifies a prefix, colored by level, prepended to each log message.

#### `timestamp`

Type: `Boolean`

If `true`, will prepend a timestamp in the `HH:mm:ss` format to each log message.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)

```

```
