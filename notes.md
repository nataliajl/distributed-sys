# Relógio lógico de Lamport
Processo mantém um contador local Ci

1. Antes de executar um evento (enviar msg, entregar msg a
uma aplicação, etc), Pi executa Ci = Ci + 1
2. Quando Pi envia msg m a Pj : ts(m) = Ci
3. Ao receber msg m, Pj faz Cj = max{Cj,ts(m)}, executa (1) e entrega mensagem para aplicação.

# Exclusão Múltua
Soluções baseadas em ficha (token)  

1. Passagem de mensagem especial entre processos – ficha
2.  Há somente uma ficha disponível
3.  Quem tem a ficha pode acessar o recurso
4. Ao terminar, ficha é passada adiante para o próximo processo
5. Se processo não precisar acessar o recurso, passa ficha adiante.

# Eleição
Algoritmo do valentão  

Processo P qualquer nota que coordenador não está mais respondendo, inicia eleição da seguinte forma:  
1. P envia mensagem ELEIÇÃO a todos os processos de número mais alto
2. Se nenhum responder, P vence a eleição e se torna coordenador
3. Se algum responder, este toma o poder e P conclui seu trabalho.
4. Processos podem receber mensagem ELEIÇÃO a qualquer momento de nós com número mais baixo.
5. Receptor envia OK de volta ao remetente, indicando que está vivo e que tomará o poder.
6. Receptor convoca uma eleição (a não ser que já tenha convocado uma)
7. Converge para situação onde todos desistem, exceto um, que será o novo coordenador.
8. Este anuncia a vitória enviando a todos os processos informando que ele é o novo coordenador.