# BarberPro Mobile

Aplicativo mobile de agendamento para barbearias desenvolvido com React Native e Expo.

## Funcionalidades

- **Tela Inicial (Home)**: Serviços populares, barbearias próximas via GPS, mais bem avaliadas
- **Explorar**: Listagem completa com FlatList otimizada (12+ barbearias), filtros por avaliação, distância e preço, busca por nome
- **Detalhes da Barbearia**: Imagem hero, informações completas, lista de serviços, barbeiros, botão de agendamento
- **Agendamento**: Seleção de data, horário e barbeiro com confirmação visual
- **Perfil**: Foto de perfil via câmera/galeria, dados pessoais, histórico de agendamentos, configurações

## Tecnologias Utilizadas

- **React Native** — Framework mobile
- **Expo SDK 56** — Plataforma de desenvolvimento
- **React Navigation** — Navegação (Stack Navigator + Bottom Tab Navigator)
- **FlatList** — Listagem otimizada com 12+ itens
- **expo-location** — Sensor GPS para barbearias próximas
- **expo-image-picker** — Sensor de Câmera para foto de perfil
- **AsyncStorage** — Persistência local da foto de perfil
- **TypeScript** — Tipagem estática
- **@expo/vector-icons (Ionicons)** — Ícones

## Sensores Implementados

1. **Geolocalização (GPS)**: Obtém a localização do usuário para calcular a distância até cada barbearia e ordenar por proximidade
2. **Câmera / Galeria**: Permite tirar foto ou selecionar da galeria para foto de perfil do usuário

## Estrutura do Projeto

```
BarberProMobile/
├── App.tsx                    # Ponto de entrada com NavigationContainer
├── src/
│   ├── navigation/            # Navegadores (Tab + Stack)
│   ├── screens/               # 5 telas do app
│   ├── components/            # Componentes reutilizáveis
│   ├── data/                  # Dados mock (12 barbearias)
│   ├── hooks/                 # Hooks customizados (useLocation, useCamera)
│   ├── theme/                 # Cores, espaçamento, tipografia
│   ├── types/                 # Interfaces TypeScript
│   └── utils/                 # Utilitários (cálculo de distância)
```

## Como Executar

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta
cd BarberProMobile

# Instalar dependências
npm install

# Iniciar o app
npx expo start
```

Após iniciar, escaneie o QR Code com o app **Expo Go** no celular.

## Screenshots

_Adicionar screenshots do app em funcionamento_

## Autor

- **Nome**: Arthur
- **Matrícula**: 01816200
- **Disciplina**: Desenvolvimento para Dispositivos Móveis — 2026.1
- **Instituição**: Centro Universitário Maurício de Nassau (UNINASSAU)
- **Professor**: Prof. Dr. Diogo Francisco Borba Rodrigues
