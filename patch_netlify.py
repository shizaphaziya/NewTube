with open('netlify.toml', 'w') as f:
    f.write('''[build]
  command = "bun install && bun run build"
  publish = ".output/public"

[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "unsafe-none"
    Cross-Origin-Opener-Policy = "unsafe-none"
''')
