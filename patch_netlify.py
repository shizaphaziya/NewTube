with open('netlify.toml', 'w') as f:
    f.write('''[build]
  command = "bun run build"
  publish = ".output/public"

[build.environment]
  BUN_VERSION = "1.0.3" # or latest

[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "unsafe-none"
    Cross-Origin-Opener-Policy = "unsafe-none"
''')
