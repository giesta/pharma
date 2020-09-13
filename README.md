# pharma
Laravel 8+React+Docker+JWT <br>
```
$ cp .env.example .env
$ composer install
$ docker-compose -f docker-compose-api.yml -f docker-compose-ui.yml up -d
$ docker-compose -f docker-compose-api.yml  run --rm --no-deps app php artisan migrate
$ docker-compose -f docker-compose-api.yml  run --rm --no-deps app php artisan key:generate
$ docker-compose -f docker-compose-api.yml  run --rm --no-deps app php artisan jwt:secret
```
