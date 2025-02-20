# Installation

## Copier le fichier .env.example et le renommer en .env

```bash
cp .env.example .env
```

Ajouter la clé API OpenAI dans le fichier .env

## Installation des dépendances

```bash
npm install
```

## Lancement de Docker pour la base de données

```bash
docker-compose up --build -d
```

## Lancement des migrations 

```bash
npx sequelize-cli db:migrate
```

## Lancement du serveur

```bash
npm run dev
```

