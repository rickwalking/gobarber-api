# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar o Amazon SES para envios em produçao;
- O envio de e-mails deve acontecer em segundo plano (background job)

**RN**

- O link enviado por email para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha;

**RNF**

**RN**

- O usuário não pode alterar seu email parau um email não utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuãrio precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder lisitar seus agendamentos de um dia específico.
- O prestador deve receber uma notificação sempre que houver um novo agendamento.
- O prestador deve poder visualizar as notificações não lidas.

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- as notifcações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar.

# Agendamento de serviços

**RF**
- O usuário deve poder listar todos os prestadores de serviços cadastrados.
- O usuário deve poder listas os dias de um mês com pelo menos um horãrio disponĩvel de um prestador.
- O usuário deve poder listar horários disponíveis em um dia específico deu um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador.

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente.
- Os agendamentos devem estar disponíveis entre 8h às 18h(PRimeiro às 8h, último as 17h);
- O usuário não pode agendar em um horário já ocupado.
- O usuário não pode agendar em um horário que já passou.
- O usuário não pode agendar serviços consigo mesmo.
