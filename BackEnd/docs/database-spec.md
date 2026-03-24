## Visao geral

O banco foi estruturado para atender o MVP com foco em:

- autenticacao por email e senha;
- campanhas com mestre e jogadores;
- um personagem ativo por jogador em cada campanha;
- historico de personagens mortos ou desativados sem exclusao;
- ficha flexivel via JSON;
- metricas separadas das rolagens;
- timeline da campanha;
- missoes com vinculo opcional a eventos;
- notas do mestre;
- log curto de rolagens.

## Tabelas implementadas

As seguintes tabelas foram implementadas em [database/schema.sql](../database/schema.sql):

- `users`
- `campaigns`
- `campaign_members`
- `characters`
- `character_stat_events`
- `missions`
- `timeline_events`
- `gm_notes`
- `dice_rolls`

## Regras importantes ja cobertas

1. Um personagem ativo por usuario em cada campanha:
   - Enforced por chave unica em `characters` com coluna gerada `is_active_flag`.

2. Personagens historicos sao preservados:
   - Uso de `status` e `deactivated_at` em vez de exclusao fisica.

3. Metricas separadas das rolagens:
   - `character_stat_events` guarda dano/cura para dashboard.
   - `dice_rolls` guarda apenas log curto para interface.

4. Mestre tambem aparece como membro:
   - Estrutura permite `campaigns.gm_user_id` + `campaign_members.role = 'GM'`.

5. Timeline com missao opcional:
   - `timeline_events.mission_id` e nullable com `ON DELETE SET NULL`.

6. Apenas 20 rolagens por campanha:
   - Trigger `trg_dice_rolls_keep_last_20` remove automaticamente as mais antigas.

## Defaults usados

- `campaigns.system_key = '5E_SRD'`
- `campaigns.status = 'ACTIVE'`
- `campaigns.is_public = 0`
- `characters.status = 'ACTIVE'`
- `missions.status = 'ACTIVE'`
- `missions.is_visible_to_players = 0`
- `timeline_events.is_visible_to_players = 0`
