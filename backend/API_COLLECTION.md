# API Collection & Data Strategy (Football-Data.org v4)

Este documento define a estratégia de arquitetura do backend, os esquemas de banco de dados e as coleções de API para sincronização do **TATIC PRO**.

---

## 📌 Visão Geral da API

- **Provedor Primário**: [Football-Data.org v4](https://www.football-data.org/)
- **Coleção Postman**: Arquivo incluso no repositório em `backend/football-data-v4-collection.json`
- **Autenticação**: Header HTTP `X-Auth-Token: <YOUR_API_KEY>`
- **Limite da API (Rate Limit)**: **10 requisições por minuto** (Plano Gratuito)

---

## ⚡ Estratégia de Atualização do Banco de Dados (Cache Layer)

Para contornar o limite de 10 requisições/minuto e garantir resposta instantânea (< 50ms) na prancha tática:

1. **Sem Consumo Direto no Frontend**: O frontend consome exclusivamente a API própria do backend (ou banco local sincronizado).
2. **Cron Scheduler no Backend**:
   - **Competições & Seleções/Times**: Atualização semanal (raras mudanças de elenco).
   - **Jogos & Elencos da Copa do Mundo**: Atualização diária.
   - **Placar & Lineups de Partidas em Andamento**: Polling controlado a cada 6 minutos (respeitando o teto de 10 req/min).

---

## 🗄️ Esquemas de Dados e Coleções do Banco

### 1. `competitions`
```json
{
  "id": "WC",
  "code": "WC",
  "name": "FIFA World Cup",
  "type": "CUP",
  "emblem": "https://crests.football-data.org/764.svg",
  "season": 2026,
  "teamsCount": 32
}
```

### 2. `matches`
```json
{
  "id": 327117,
  "competitionCode": "WC",
  "utcDate": "2026-07-02T16:00:00Z",
  "status": "SCHEDULED",
  "matchday": 1,
  "stage": "GROUP_STAGE",
  "group": "GROUP_A",
  "homeTeam": {
    "id": 764,
    "name": "Brasil",
    "shortName": "BRA",
    "crest": "https://crests.football-data.org/764.svg",
    "primaryColor": "#FDE047",
    "secondaryColor": "#16A34A"
  },
  "awayTeam": {
    "id": 776,
    "name": "Japão",
    "shortName": "JPN",
    "crest": "https://crests.football-data.org/776.svg",
    "primaryColor": "#2563EB",
    "secondaryColor": "#FFFFFF"
  },
  "score": {
    "fullTime": { "home": null, "away": null }
  }
}
```

### 3. `teams`
```json
{
  "id": 764,
  "name": "Brasil",
  "shortName": "BRA",
  "tla": "BRA",
  "crest": "https://crests.football-data.org/764.svg",
  "countryCode": "BR",
  "primaryColor": "#FDE047",
  "secondaryColor": "#16A34A",
  "textColor": "#0F172A",
  "squad": [
    {
      "id": 16275,
      "name": "Alisson",
      "position": "Goalkeeper",
      "shirtNumber": 1,
      "nationality": "Brazil"
    }
  ]
}
```

### 4. `tactical_boards`
```json
{
  "id": "tb-327117",
  "matchId": 327117,
  "homeTeamFormation": "4-3-3",
  "awayTeamFormation": "3-4-2-1",
  "attackingTeamId": "home",
  "lines": [],
  "arrows": []
}
```

---

## 📡 Endpoints Principais (Mapeamento Postman)

| Endpoint | Método | Descrição | Frequência de Cache |
|---|---|---|---|
| `/v4/competitions` | GET | Lista de Competições | 7 dias |
| `/v4/competitions/WC/matches` | GET | Jogos da Copa do Mundo | 24 horas |
| `/v4/competitions/WC/teams` | GET | Seleções participantes da Copa | 7 dias |
| `/v4/teams/{id}` | GET | Elenco completo da seleção (com shirtNumber) | 7 dias |
| `/v4/matches/{id}` | GET | Lineup de partida (Escalação de Titulares + Banco) | 1 hora |
