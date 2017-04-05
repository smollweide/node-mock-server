NPM_TOKEN ?= '000-0000000000'
CI_BUILD_NUMBER ?= 2 
VERSION ?= 0.0.$(CI_BUILD_NUMBER)

package:
	# https://docs.npmjs.com/cli/install
	@npm install --only=production --slient

test: package
	# https://docs.npmjs.com/cli/install
	@npm install --only=dev --slient
	# https://docs.npmjs.com/cli/test
	@npm test

publish: test
	@echo "//registry.npmjs.org/:_authToken=$(NPM_TOKEN)" > ~/.npmrc
	@echo "publishing $(VERSION)"
	# https://docs.npmjs.com/cli/version
	@npm version --no-git-tag-version $(VERSION)
	# https://docs.npmjs.com/cli/publish
	@npm publish

version:
	@echo $(VERSION)
