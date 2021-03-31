source deploy.env
echo "Running build";

echo "Syncing built files to: s3://$UI_BUCKET_NAME/"
aws s3 sync plain-client/ s3://$UI_BUCKET_NAME/
echo "Files synced successfully"

echo "Invalidating cloudfront distribution"

# aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST --paths "/*"