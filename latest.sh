#!/bin/bash

fetch_latest_version() {
  local package_name="$1"
  
  if command -v pnpm &> /dev/null; then
    package_manager="pnpm"
  elif command -v npm &> /dev/null; then
    package_manager="npm"
  else
    echo "Error: Couldn't identify package manager."
    exit 1
  fi

  case "$package_manager" in
    "pnpm")
      latest_version=$(pnpm view "$package_name" version)
      ;;
    "npm")
      latest_version=$(npm view "$package_name" version)
      ;;
    *)
      echo "Error: Unknown package manager."
      exit 1
      ;;
  esac

  echo "$package_name: $latest_version"
}

declare -a arr=("chalk" "cookie-parser" "copyfiles" "ejs" "eslint" "express" "hbs" "http-errors" "morgan" \ 
"nodemon" "prettier" "rimraf" "@types/cookie-parser" "@types/express" "@types/http-errors" "@types/morgan" \
"@types/node" "tsx" "typescript")

echo "Fetching the latest versions..."

for package_name in ${arr[@]}; do
  fetch_latest_version "$package_name"
done

echo "Done!"
