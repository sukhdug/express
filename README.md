# README #
TODO-лист с авторизацией, регистрацией и ролями admin/user.

## Установка ##

Склонируйте репозиторий на локальный компьютер
```shell
git clone https://github.com/sukhdug/express.git
```

Далее, введите следующие команды для установки зависимостей

```shell
cd express
npm install
```

После этого можно запустить приложение и и оно будет доступно
http://127.0.0.1:3000 по адресу.

```shell
npm start
```
Дамп БД находится в директории _dump/express

Конфиг к БД находится в файле /config/database.js

## Недостатки ##
* ES5
* недоделана пагинация (точнее выбор страницы)
* не хватает валидации (например, проверка даты или почты)
* есть некоторые косяки с формой (форма с селектом - по умолчанию только первый вариант,
  а не то, что было ранее выбрано)
* возможно и другие недостатки есть

## Использованные библиотеки ##
* [Express](https://github.com/expressjs/express)
* [Mongoose](https://github.com/Automattic/mongoose)
* [Body-parser](https://github.com/expressjs/body-parser)
* [Morgan](https://github.com/expressjs/morgan)
