# vscode-ruby-interpreter-locator

A Node.js library for discovering available Ruby interpreters on your system. The following environment managers are supported:

* asdf
* chruby
* Homebrew
* rbenv

# Usage

```
import { getInterpreters } from "vscode-ruby-interpreter-locator";
await getInterpreters();
```

# TODO
* Write a test for chrubyLocator
* Support version
* Create API
* Support RVM
* Write a test for envVariablesLocator
* Write a test for PathsReducer
