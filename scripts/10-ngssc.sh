#!/bin/sh
set -e
# Inject specified environment variables into all index.html files under the app root:
ngssc insert /usr/share/nginx/html \
	--env PROD \
	--env API_ADDRESS \
	--env STRIPE_PK \
	--env AUTH_DOMAIN \
	--env AUTH_CLIENT_ID \
	--env AUTH_AUDIENCE \
	--env DEFAULT_LANG \
	--env SUPPORTED_LANGS