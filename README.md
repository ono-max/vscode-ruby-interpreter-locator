# vscode-ruby-interpreter-locator

A Node.js library for discovering available Ruby interpreters on your system. The following environment managers are supported:

* asdf
* chruby
* Homebrew
* rbenv
* rvm

# Usage

```
import { getInterpreters } from "vscode-ruby-interpreter-locator";
await getInterpreters();
```

# Acknowledgement

I would like to thank the following projects, which served as references during the creation of this project:

* [microsoft/vscode-python](https://github.com/microsoft/vscode-python)
* [Eskibear/node-jdk-utils](https://github.com/Eskibear/node-jdk-utils)

# TODO
* Create API
* Write a test for envVariablesLocator
* Write a test for PathsReducer
* Write a test for sorting logic
* Come up with a solution to cache these interpreter information
* Setup CI
