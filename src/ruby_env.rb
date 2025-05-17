require "json"

env = {
  ruby_version: RUBY_VERSION,
  gem_home: Gem.path
}

puts JSON.generate(env)
