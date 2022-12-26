# Task List

Aplicativo feito em React, com conexão ao Firestore (Firebase).
Este aplicativo usa BootStrap5 como ajuda de desenvolvimento.

## Como rodar
1. Instale as dependencias
```
yarn || npm i
```

2. Modifique o arquivo `firebaseConfig.js`
```js
const firebaseConfig = {
  apiKey: "<sua api key>",
  authDomain: "<seu auth domain>",
  databaseURL: "<sua database url>",
  projectId: "<seu projeto id>",
  storageBucket: "<seu storage bucket>",
  messagingSenderId: "<seu msg id>",
  appId: "<seu app id>"
};
```
Como achar essas informações?
* Adicione o Firestore ao projeto
* Adicione um app do tipo web
* Configure o SDK com NPM
* Copie o arquivo gerado e atualize os dados

3. Rode o projeto
```
yarn start || npm start
```

## Páginas
Temos apenas quatro páginas

1. Home

Tela principal do App, onde aparece as Tasks com prioridade alta e em andamento.

2. Login

Tela onde autenticamos o usuário.

3. Register

Tela onde criamos um novo usuário.

4. Reset

Tela onde o usuário pode resetar sua senha.

5. TaskCreate

Tela onde o usário pode criar suas tasks

6. TaskEdit

Tela onde editamos uma tarefa.

7. TaskList

Tela onde listamos todas as tasks.

8. Dashboard

Tela onde mostra quantas tasks o usuário possui, quantas estão em andamento e quantas estão completas.

## Componentes


1. Header

Header que dropdown menu com todas opções de páginas.

