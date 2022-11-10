GIT_COMMIT=$(shell git rev-parse HEAD || echo '?')
GIT_TREE=$(shell git diff-index --quiet HEAD -- && echo clean || echo dirty)
GIT_TAG=$(shell git describe --tags --abbrev=0)
GIT_VERSION=$(shell git describe --tags --dirty || echo dev-$(shell date -u +"%Y%m%d%H%M%S"))

DOCKER_TAG=$(GIT_TAG)

# $(info $$var is [${DOCKER_TAG}])

build:
	docker build \
	--progress plain \
	--build-arg GIT_VERSION=${GIT_VERSION} \
	-t patelvivek7879/e-commerce:${DOCKER_TAG} \
	-f ./docker/Dockerfile .
	docker tag patelvivek7879/e-commerce:${DOCKER_TAG} patelvivek7879/e-commerce:latest