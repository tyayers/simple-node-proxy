# Simple Node Proxy
This is a simple node proxy that ignores all self-signed certificate warnings (can be used to proxy a self-signed target behind a HTTPS load balancer).

## Deploy
```sh
PROJECT_ID=
gcloud run deploy node-proxy --source . --project $PROJECT_ID --region europe-west4 --allow-unauthenticated --set-env-vars TARGET=https://httpbin.org/anything
```