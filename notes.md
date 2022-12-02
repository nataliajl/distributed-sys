# Relógio lógico de Lamport

Processo mantém um contador local Ci

1. Antes de executar um evento (enviar msg, entregar msg a
uma aplicação, etc), Pi executa Ci = Ci + 1
2. Quando Pi envia msg m a Pj : ts(m) = Ci
3. Ao receber msg m, Pj faz Cj = max{Cj,ts(m)}, executa (1) e entrega mensagem para aplicação.