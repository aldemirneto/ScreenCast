# Banco de Dados ScreenCast

O banco de dados ScreenCast é um banco de dados PostgreSQL que armazena informações sobre assinaturas de usuários, gravações e status. Ele inclui quatro tabelas: `Subscription`, `Users`, `Recordings` e `Status`.

## Esquema

O esquema do banco de dados inclui as seguintes tabelas e colunas:


     +--------------------+          +--------------+
     | Subscription       |          | Users        |
     +--------------------+          +--------------+
     | idSubscription     | <----+   | idUser       |
     | idUser             |          | username     |
     | subscription_begin |          | password     |
     | subscription_end   |          | signs        |
     | payment_infos      |          | created_at   |
     | description        |          +--------------+
     +--------------------+
           |
           |
           v

     +---------------+          +--------------+
     | Recordings    |          | Status       |
     +---------------+          +--------------+
     | idRecordings  | <-------+| idStatus     |
     | Recording_Url |          | description  |
     | idUser        |          +--------------+
     | idStatus      |
     | created_at    |
     +---------------+

### Subscription

- `idSubscription` (integer): Identificador único para cada assinatura.
- `idUser` (integer): ID do usuário que se inscreveu.
- `subscription_begin` (timestamp): Carimbo de data/hora para quando a assinatura começou.
- `subscription_end` (timestamp): Carimbo de data/hora para quando a assinatura termina.
- `payment_infos` (text): Informações de pagamento para a assinatura.
- `description` (varchar(500)): Descrição da assinatura.

### Users

- `idUser` (integer): Identificador único para cada usuário.
- `username` (varchar): Nome de usuário para o usuário.
- `password` (varchar): Senha criptografada para o usuário.
- `signs` (boolean): Se o usuário concordou com os termos e condições.
- `created_at` (timestamp): Carimbo de data/hora para quando a conta do usuário foi criada.

### Recordings

- `idRecordings` (integer): Identificador único para cada gravação.
- `Recording_Url` (varchar(500)): URL para a gravação.
- `idUser` (integer): ID do usuário que gravou o vídeo.
- `idStatus` (integer): ID do status da gravação.
- `created_at` (timestamp): Carimbo de data/hora para quando a gravação foi criada.

### Status

- `idStatus` (integer): Identificador único para cada status.
- `description` (varchar): Descrição do status.


## Uso

Para usar o banco de dados ScreenCast, você pode criar um novo banco de dados PostgreSQL usando o script SQL fornecido:

1. Conecte-se ao seu servidor PostgreSQL usando a ferramenta de linha de comando `psql`.
2. Crie um novo banco de dados usando o comando `CREATE DATABASE`.
3. Conecte-se ao novo banco de dados usando o comando `\c`.
4. Copie e cole o script SQL de [`ScreenCast.sql`](ScreenCast.sql) no terminal `psql`.
5. Execute o script para criar o banco de dados e as tabelas.
6. Crie novos usuários com diferentes níveis de acesso usando os comandos `CREATE USER` e `GRANT`.

Uma vez que o banco de dados estiver configurado, você pode consultar os dados usando declarações SQL regulares. Você também pode usar qualquer cliente PostgreSQL ou ORM para interagir com o banco de dados.

## Segurança

O banco de dados ScreenCast contém informações confidenciais do usuário, como nomes de usuários e senhas. É importante garantir que o banco de dados esteja adequadamente protegido para evitar acesso não autorizado. Você pode proteger o banco de dados seguindo estas práticas recomendadas:

- Restringir o acesso ao banco de dados apenas para usuários autorizados.
- Use senhas fortes para todos os usuários e não compartilhe senhas.
- Criptografe dados sensíveis, como senhas e informações de pagamento
- Faça backup regularmente do banco de dados para evitar perda de dados em caso de desastres.

## Licença
Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.


## Agradecimentos

Este projeto foi criado como parte da disciplina Projetos I no IFSP-Piracicaba. Agradecimentos especiais à Professora Andreia por sua orientação e suporte ao longo do projeto.
