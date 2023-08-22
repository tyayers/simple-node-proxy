export PROJECT=$(gcloud config get-value project)
export LOCATION=europe-west1
export NAME=proxysvc

# Build container image
gcloud builds submit --tag "eu.gcr.io/$PROJECT/$NAME"

# Deploy image to Cloud Run with the correct service account
gcloud run deploy $NAME --image eu.gcr.io/$PROJECT/$NAME \
    --platform managed --project $PROJECT \
    --min-instances=1 \
    --region $LOCATION --allow-unauthenticated \
    --set-env-vars GCLOUD_PROJECT="$PROJECT",TARGET="https://targetsvc.com/path",GOOGLE_APPLICATION_CREDENTIALS="svc-key.json"
