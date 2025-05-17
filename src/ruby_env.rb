require "json"

env = {
  version: RUBY_VERSION,
  gemHome: Gem.path
}

puts JSON.generate(env)
