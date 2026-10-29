# EndoPost 3D Studio

## Requisitos
- Node.js 20.9 ou superior
- Visual Studio Code

## Executar
1. Extraia a pasta do projeto.
2. Abra a pasta no VS Code.
3. Abra o terminal integrado.
4. Execute `npm install`.
5. Execute `npm run dev`.
6. Abra `http://localhost:3000`.

## Incluído
- Seleção de dentição permanente pela numeração FDI.
- Dente procedural 3D ilustrativo, sem dependência de arquivos GLB.
- Ajuste de altura/largura do dente em mm.
- Adição/remoção de múltiplos pinos, com comprimento/diâmetro em mm.
- Ajuste didático de posição X/Z e distância da ponta ao ápice.
- Cimento ilustrativo opcional.

## Limitação
O modelo dentário é procedural e simplificado, não uma anatomia clínica validada. Os números inseridos são dimensões configuradas da cena; para representar dimensões anatômicas reais é necessário calibrar modelos 3D confiáveis e os eixos de cada canal. As posições iniciais dos pinos são apenas ilustrativas.


### Atualização de pinos
Cada pino agora possui seleção de raiz/canal didático e distância da ponta ao ápice em mm. A posição é aproximada à raiz correspondente no modelo procedural; não é anatomia validada para uso clínico.


## Modelos anatômicos 3D e modos de visualização

O visualizador foi atualizado para carregar os modelos dentários GLB usados anteriormente e oferece dois acabamentos:
- **Realista:** cor de esmalte/dentina clara, opaca e iluminação de estúdio.
- **Holográfico:** azul-ciano, transparência e brilho emissivo sobre fundo escuro.

Os arquivos GLB devem ficar em `public/models/`. Para tentar baixá-los automaticamente, execute:

```bash
npm run models:download
```

Se você já tem os modelos da versão anterior, pode simplesmente copiar os 16 arquivos `.glb` para `public/models/`. O projeto referencia os modelos por estes nomes: `maxillary_left_central_incisor.glb`, `maxillary_lateral_incisor.glb`, `maxillary_canine.glb`, `maxillary_first_premolar.glb`, `maxillary_second_premolar.glb`, `maxillary_first_molar.glb`, `maxillary_second_molar.glb`, `maxillary_third_molar.glb`, `mandibular_left_central_incisor.glb`, `mandibular_left_lateral_incisor.glb`, `mandibular_left_canine.glb`, `mandibular_first_premolar.glb`, `mandibular_left_second_premolar.glb`, `mandibular_first_molar.glb`, `mandibular_second_molar.glb`, `mandibular_third_molar.glb`.

**Importante:** os arquivos 3D não puderam ser incorporados diretamente nesta cópia porque não estavam presentes na pasta do projeto no momento da atualização. O download automático exige conexão com a internet. A calibração dimensional é visual/didática e não deve ser usada como medição clínica.
