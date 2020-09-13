# pharma
Laravel+React+Docker
`
docker-compose -f docker-compose-api.yml -f docker-compose-ui.yml up -d
docker-compose -f docker-compose-api.yml  run --rm --no-deps app php artisan migrate
`
