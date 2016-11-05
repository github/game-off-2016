NODE_BIN = ./node_modules/.bin

.PHONY: build lint
all: lint build

build:
	$(NODE_BIN)/webpack

lint:
	$(NODE_BIN)/tslint --project ./tsconfig.json
