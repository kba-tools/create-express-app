#!/bin/bash

set -euo pipefail

readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

detect_package_manager() {
	if command -v pnpm &>/dev/null; then
		echo "pnpm"
	elif command -v npm &>/dev/null; then
		echo "npm"
	else
		echo -e "${RED}Error: No package manager found (npm or pnpm required)${NC}" >&2
		exit 1
	fi
}

fetch_latest_version() {
	local package_name="$1"
	local package_manager="$2"

	local latest_version
	if latest_version=$("$package_manager" view "$package_name" version 2>/dev/null); then
		echo -e "${GREEN}✓${NC} $package_name: ${YELLOW}$latest_version${NC}"
	else
		echo -e "${RED}✗${NC} $package_name: Failed to fetch version" >&2
	fi
}

main() {
	local packages=(
		"chalk"
		"cookie-parser"
		"copyfiles"
		"ejs"
		"eslint"
		"express"
		"hbs"
		"morgan"
		"nodemon"
		"prettier"
		"rimraf"
		"@types/cookie-parser"
		"@types/express"
		"@types/morgan"
		"@types/node"
		"tsx"
		"typescript"
	)

	echo "Detecting package manager..."
	local package_manager
	package_manager=$(detect_package_manager)
	echo -e "Using: ${GREEN}$package_manager${NC}\n"

	echo "Fetching latest versions for ${#packages[@]} packages..."
	echo

	for package_name in "${packages[@]}"; do
		fetch_latest_version "$package_name" "$package_manager"
	done

	echo
	echo -e "${GREEN}Done!${NC}"
}

main "$@"
