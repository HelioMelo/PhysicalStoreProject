## Sistema de Gerenciamento de Lojas

## Visão Geral

Este projeto é um Sistema de Gerenciamento de Lojas que permite registrar lojas e encontrar lojas próximas com base no CEP e endereço.

## Funcionalidades

- Registro de loja com validação de endereço e documento
- Recuperação e listagem de lojas próximas a uma determinada localização
- Geocodificação utilizando a API do Nominatim
- Recuperação de dados de endereço utilizando a API do ViaCEP

## Primeiros Passos

### Pré-requisitos

- Node.js instalado
- Banco de dados PostgreSQL configurado (é necessário criar um banco de dados, onde as tabelas serão criadas automaticamente)

### Instalação

1. Clone o repositório:
2. npm install

### Configure o banco de dados:

Crie um arquivo .env e configure suas variáveis de ambiente:
.env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
PORT=

### Inicie o servidor de desenvolvimento:

npm run dev

### Registrar Loja

http://localhost:PORT/api/stores

Método: POST

Descrição: Registra uma nova loja.

Corpo da Requisição:

{
"name": "",
"document": "",
"address": {
"zipCode": "",
"number": "" NÃO E OBRIGATORIO
}
}

### Encontrar Lojas Próximas

http://localhost:PORT/api/stores/nearby

Método: POST

Descrição: Encontra lojas dentro de um raio de 100 km do endereço fornecido.

Parâmetros de Consulta:

{
"zipCode": ""
}

zipCode: O código postal do endereço.

number: O número da rua (opcional).
