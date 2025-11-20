# Cliente da API - React Native (Expo)

Este é o aplicativo cliente móvel, desenvolvido com **React Native** e **Expo**, para consumir a [API de Gerenciamento de Clientes em Laravel](link-para-o-repositorio-da-sua-api). O aplicativo permite a autenticação de usuários e a visualização de uma lista de clientes, servindo como uma base sólida para um aplicativo de negócios completo.

## 🖼️ Telas do Aplicativo

*(Dica: Substitua os links abaixo pelos links das suas screenshots no GitHub)*

| Tela de Login                                       | Tela de Clientes                                        |
| --------------------------------------------------- | ------------------------------------------------------- |
| ![Tela de Login](https://github.com/SauloCunha02/frontend-react-native--api-laravel12/blob/main/assets/images/login.PNG) | ![Tela de Clientes](https://github.com/SauloCunha02/frontend-react-native--api-laravel12/blob/main/assets/images/home.PNG) |


## ✨ Tecnologias Utilizadas

-   **React Native:** Framework para desenvolvimento de aplicativos nativos com JavaScript e React.
-   **Expo & Expo Router:** Utilizado para um desenvolvimento mais rápido e para a navegação baseada em arquivos, similar ao Next.js.
-   **TypeScript:** Garante a segurança de tipos e a robustez do código.
-   **Axios:** Cliente HTTP para comunicação com a API, configurado com interceptors para automação de autenticação.
-   **React Context API:** Utilizada para o gerenciamento de estado global de autenticação (`AuthContext`).
-   **React Native Keychain:** Para armazenamento seguro do token de autenticação em ambientes nativos (iOS/Android).

## 🏛️ Visão Geral da Arquitetura

O projeto foi estruturado com foco em separação de responsabilidades e escalabilidade.

-   **Navegação com Expo Router:** A estrutura de navegação é definida pela organização de arquivos na pasta `app/`. Utilizamos "grupos de rotas" para separar logicamente as telas públicas `(auth)` das telas protegidas `(tabs)`.

-   **Gerenciamento de Estado com `AuthContext`:** O `AuthContext` é a única fonte da verdade sobre o estado de autenticação do usuário. Ele expõe o estado (`authenticated`, `isLoading`) e as funções (`signIn`, `signOut`) para toda a aplicação.

-   **Armazenamento Seguro Abstrato:** Foi criada uma camada de abstração (`src/services/secureStorage.ts`) que decide dinamicamente qual mecanismo de armazenamento usar. Ele utiliza `react-native-keychain` para a segurança nativa no iOS e Android, e `localStorage` como fallback para a plataforma web, tornando o `AuthContext` agnóstico em relação à plataforma.

-   **Serviço de API com Axios:** A comunicação com o backend é centralizada em uma instância do Axios (`src/api/axios.ts`). Um interceptor de *request* anexa automaticamente o token de autenticação a cada chamada para rotas protegidas, mantendo o resto do código limpo.

## 🚀 Guia de Instalação e Setup

Siga os passos abaixo para configurar o projeto em seu ambiente local.

**1. Clonar o Repositório**
```bash
git clone https://github.com/seu-usuario/seu-repositorio-react-native.git
cd seu-repositorio-react-native
```

2. Instalar Dependências do Node.js

```bash
npm install
```
ou
```bash
yarn install
```

3. Configurar o Endereço da API

Este é o passo mais importante. O aplicativo precisa saber onde encontrar a sua API Laravel.

Crie um arquivo chamado .env na raiz do projeto.
Adicione a seguinte variável, substituindo o IP pelo endereço IP da máquina onde seu servidor Laravel está rodando:
```dotenv
# .env
EXPO_PUBLIC_API_URL=http://192.168.1.110/laravel-sanctum-api/public/api
```
Importante: Não use localhost ou 127.0.0.1. O emulador/dispositivo móvel precisa do IP da sua máquina na rede local. Certifique-se de que seu computador e seu dispositivo de teste estejam na mesma rede Wi-Fi.

4. Iniciar o Servidor de Desenvolvimento

Inicie o servidor.

```bash
npm start
```
Isso abrirá o Metro Bundler no seu navegador. Você pode então escanear o QR Code com o aplicativo Expo Go no seu celular ou rodar o app em um emulador (pressionando a para Android ou i para iOS no terminal).

📁 Estrutura de Pastas
A estrutura do projeto separa claramente as rotas da lógica da aplicação.

```code
.
├── app/                # Definição de rotas e layouts (Expo Router)
│   ├── (auth)/         # Rotas públicas (login, registro, etc.)
│   └── (tabs)/         # Rotas protegidas após o login
│   └── _layout.tsx     # Layout raiz, orquestrador da autenticação
│
├── src/                # Lógica da aplicação
│   ├── api/            # Configuração do Axios e serviços de API
│   ├── components/     # Componentes de UI reutilizáveis
│   ├── contexts/       # Contextos globais (AuthContext)
│   ├── services/       # Serviços de negócio (secureStorage)
│   └── types/          # Definições de tipos do TypeScript
│
└── ...                 # Outros arquivos de configuração
