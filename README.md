# vscode-ruby-interpreter-locator

This library is designed for VS Code extension developers. The VS Code API is used in this library.

A Node.js library for discovering available Ruby interpreters on your system. The following environment managers are supported:

* [asdf](https://asdf-vm.com/)
* [chruby](https://github.com/postmodern/chruby)
* [Homebrew](https://brew.sh/)
* [rbenv](https://rbenv.org/)
* [rvm](https://rvm.io/)

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
* Refactor index.ts by introducing a design pattern.
* Write a test for envVariablesLocator
* Write a test for PathsReducer
* Come up with a solution to cache these interpreter information
