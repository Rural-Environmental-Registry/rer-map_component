# MAPA DPG

MapaDPG é um componente de mapa interativo para aplicações Vue.js que permite customização de camadas, opções de mapa e
ferramentas de desenho. A biblioteca é baseada em Leaflet.js e oferece suporte a múltiplas camadas, ferramentas de
desenho personalizadas e interface adaptável.

*Atenção: Essa biblioteca pode ser utilizada apenas para projetos em Vue.js 3.*


> *** Antes de editar,
> leia [Wiki versionamento](https://inovacao.dataprev.gov.br/git/car-dpg/map-component/wikis/Versionamento) ***

## Instalação

Execute o seguinte comando uma única vez em sua máquina, substituindo `<SEU_USUARIO>` e `<SEU_TOKEN>` por suas
credenciais de acesso:

```bash
git config --global url."https://<SEU_USUARIO>:<SEU_TOKEN>@inovacao.dataprev.gov.br".insteadOf "https://inovacao.dataprev.gov.br"
```

Após executar este comando, o Git irá automaticamente usar suas credenciais ao buscar dependências do
`inovacao.dataprev.gov.br`.

Por se tratar de uma biblioteca versionada, substitua `<VERSION>` pela versão que deseja. Exemplo v3.0

```package.json
"dependencies": {
  "dpg-mapa": "git+https://inovacao.dataprev.gov.br/git/car-dpg/map-component.git#<VERSION>",
}

```

Registrando globalmente no main.js:

```js
import { createApp } from 'vue'
import MapaDpg from 'node_modules/dpg-mapa/dist'

const app = createApp({})


app.component('MapaDpg', MapaDpg)

app.mount('#app')
```

Ou registrando localmente:

```js
<template>
  <MapaDpg/>
</template>

<script setup>
  import MapaDpg from 'node_modules/dpg-mapa/dist'
</script>
```

Em ambos os casos é necessário importar o arquivo de estilos do mapa.

```css
@import 'node_modules/dpg-mapa/dist/index.css';
```

## Utilização

O componente aceita parametros e emite eventos. Além disso, expôe instâncias atraves de refs.

```vue

<template>
  <MapaDpg
      :layers="layers"
      :options="options"
      :showLoading="showLoading"
      :disableLoading="disableLoading"
      :descriptiveMemorial="descriptiveMemorial"
      @onChildLayerToggle="onChildLayerToggle"
      @onGroupLayerToggle="onGroupLayerToggle"
      @onDrawing="onDrawing"
      ref="mapRef"
  />
</template>
<script setup>
  const mapRef = ref(null)

  const mapRefInstances = computed(() => {
    return {
      map: mapRef.value?.map,
      layerControl: mapRef.value?.layerControl,
      drawItemsGroup: mapRef.value?.drawItemsGroup,
      leaflet: mapRef.value?.leaflet
    }
  })
</script>  
```

### Propriedades

| Nome                | Tipo                                      | Obrigatório | Descrição                                                                  |
|---------------------|-------------------------------------------|-------------|----------------------------------------------------------------------------|
| showLoading         | boolean                                   | Opcional    | Controla a visibilidade da animação de carregamento.                       |
| layers              | [MapLayers](docs/properties.md)           | Opcional    | Define as camadas base e camadas customizadas.                             |
| options             | [MapOptionsConfig](docs/properties.md)    | Opcional    | Define as configurações do mapa, menu de camadas e ferramentas de desenho. |
| disableLoading      | boolean                                   | Opcional    | Desabilita o animação de carregamento.                                     |
| descriptiveMemorial | [DescriptiveMemorial](docs/properties.md) | Opcional    | Controla a visibilidade do memorial descritivo.                            |

### Eventos

| Nome               | Descrição                                                                                                                                 |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------| 
| onChildLayerToggle | Emite os dados da camada adicionada/removida do mapa                                                                                      |
| onGroupLayerToggle | Emite os dados do grupo e das suas camadas adicionadas/removidas do mapa                                                                  |
| onDrawing          | Emite os dados do(s) desenho(s) adicionado(s)/removido(s) do mapa. Poligonos e retângulos são incrementados com a propriedade "drawnArea" |
| onCoordinateSystemChange | Emite o sistema de referência selecionado no memorial descritivo (ex.: `SIRGAS2000`)                                                      |
| onFullscreenChange | Emite `true`/`false` quando o mapa entra ou sai de tela cheia                                                                               |
| onMeasureComplete  | Emite área medida (`m2`, `km2`, `ha`, `geojson`) após medição efêmera (não dispara `onDrawing`)                                           |

### Instâncias

| Nome              | Descrição                                                           |
|-------------------|---------------------------------------------------------------------|
| map               | Mapa Leaflet. Utilizada para manipulação do mapa                    |
| layerControl      | Controle de camadas Leaflet. Utilizada para manipulação das camadas |
| drawItemsGroup    | Grupo de desenhos Leaflet. Utilizada para manipulação dos desenhos  |
| leaflet           | Instância Leaflet.                                                  |
| centerMap         | Centraliza/enquadra o mapa conforme `options.tools.center`          |
| toggleFullscreen  | Alterna tela cheia                                                  |
| enterFullscreen   | Entra em tela cheia                                                 |
| exitFullscreen    | Sai de tela cheia                                                   |
| toggleMeasureArea | Ativa/desativa modo de medição de área (legado; preferir os botões de linha/polígono em `options.tools`) |
| toggleCoordinatePanel | Abre ou fecha o painel do memorial descritivo                                                             |
| closeCoordinatePanel  | Fecha o painel do memorial descritivo                                                                     |

### Memorial descritivo

Quando `descriptiveMemorial.show` é `true`, o mapa exibe um painel lateral com três formas de informar a geometria da propriedade:

| Aba | Entrada | Saída no mapa |
|-----|---------|---------------|
| Preenchimento manual | Pontos com coordenadas (DD ou DMS), azimute e distância | WKT (`POINT`, `LINESTRING` ou `POLYGON`) |
| Upload CSV | Arquivo `.csv` com colunas `X`, `Y`, `AZIMUTH`, `DISTANCIA` (ou `DISTANCE`) | WKT (`POLYGON`) |
| Upload Shapefile | Arquivo `.zip` contendo shapefile (`.shp`, `.shx`, `.dbf`) | GeoJSON (`Polygon` ou `MultiPolygon`) |

Geometrias do memorial são marcadas internamente com `options.memorialKey = 'memorial'` e disparam `onDrawing` com `type: 'created'`, permitindo que a aplicação consumidora aplique a geometria na camada de propriedade.

#### Upload Shapefile (.zip)

Requisitos do arquivo:

- Formato: `.zip` com shapefile completo (`.shp`, `.shx` e `.dbf`; `.prj` recomendado).
- **Uma única geometria** (um feature no shapefile).
- Tipos aceitos: `Polygon` ou `MultiPolygon` (MultiPolygon com várias partes é válido).
- A geometria deve estar **fechada** e **topologicamente válida** (sem auto-interseção, área maior que zero).

Validações rejeitam, entre outros:

- Mais de um feature no shapefile.
- Geometrias do tipo `Point`, `LineString` etc.
- Anéis abertos ou polígonos com área zero.
- Auto-interseções.

O parse é feito no browser (`shpjs`); não há envio ao backend. A projeção do shapefile deve coincidir com o sistema de referência esperado pela aplicação (ex.: SIRGAS 2000) — não há reprojeção automática.

Textos da aba e mensagens de erro podem ser customizados via `descriptiveMemorial.customTexts` (chaves `shapefileUpload`, `shapefileFileUpload`, `dragShapefileZip`, `shapefileZipInfo`, `shapefileAppliedSuccess`).

#### Ferramentas de medição

Com `options.tools.show: true`, o mapa exibe controles de tela cheia, centralização e medição efêmera (linha e polígono). A medição **não** adiciona camadas permanentes nem dispara `onDrawing`; o resultado é emitido em `onMeasureComplete`.

Configuração adicional em `options.tools`:

| Propriedade | Descrição |
|-------------|-----------|
| `measureLine` | Botão de medição de distância entre dois pontos |
| `measurePolygon` | Botão de medição de área por polígono desenhado |
| `measureArea` | Modo legado de medição de área |
| `showInteractionPanel` | Exibe o painel flutuante (ajuda + Cancelar/Finalizar). Default `true`. Com `false`, a instrução fica só no `title` (tooltip) do botão |
| `texts` | Rótulos do painel de medição (distância, área, ajuda, cancelar, finalizar) |

### Injeção menu lateral

Esses pontos permitem que aplicações consumidoras injetem conteúdo próprio no menu lateral do MapaDPG.

| Nome        | ID                        | Posição no menu | Descrição                                                     |
|-------------|---------------------------|-----------------|---------------------------------------------------------------|
| Top menu    | `external-id-top-menu`    | topo            | Contêiner para inserir conteúdo antes da listagem de camadas. |
| Bottom menu | `external-id-bottom-menu` | base            | Contêiner para inserir conteúdo após a listagem de camadas.   |

Para exemplos, consulte o guia: [Injeção de Conteúdo](docs/contentInjection.md)

## Exemplos de parametros

```js
const props = {
  showLoading: true,
  disableLoading: false,
  descriptiveMemorial: {
    show: true,
    customTexts: {
      title: 'New title',
      addPoint: 'Custom text',
      shapefileUpload: 'Upload Shapefile',
      shapefileZipInfo: 'Envie um .zip com .shp, .shx e .dbf contendo uma única geometria Polygon ou MultiPolygon'
    }
  },
  layers: {
    baseMapLayers: [
      {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        key: 'osm',
        default: true,
        tms: false,
        minZoom: 3,
        maxZoom: 17,
        maxNativeZoom: 18,
        errorTileUrl: 'https://...',
        minZoomWarning: 3
      }
    ],
    customLayers: [
      {
        name: 'Camadas Customizadas',
        key: 'custom',
        toggle: {
          active: 'Ativar',
          inactive: 'Desativar'
        },
        layers: [
          {
            baseUrl: 'https://...',
            layers: 'geoserver_key',
            format: 'image/png',
            transparent: true,
            name: 'WMS Layer',
            activeDefault: true,
            active: true,
            key: 'wms_layer',
            cqlFilter: '...',
            toggle: {
              active: 'Ativar',
              inactive: 'Desativar'
            },
            style: {
              color: '#ff0000',
              fillColor: '#00ff00'
            },
          },
          {
            geojson: {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "Polygon",
                "coordinates": []
              },
            },
            name: 'GEOJSON Layer',
            activeDefault: true,
            active: true,
            key: 'geojson_layer',
            toggle: {
              active: 'Ativar',
              inactive: 'Desativar'
            },
            style: {
              color: '#ff0000',
              fillColor: '#00ff00'
            },
          }
        ]
      }
    ]
  },
  options: {
    map: {
      config: {
        id: 'map',
        zoomControl: true,
        zoomControlPosition: 'topright',
        minZoom: 3,
        maxZoom: 17,
        center: [-15.235, -51.9253],
        zoom: 4,
        dragging: true,
        scrollWheelZoom: true,
        removeControlLayers: true
      }
    },
    layersMenu: {
      size: 'small',
      persist: true,
      removeMenu: false
    },
    tools: {
      show: true,
      position: 'topright',
      fullscreen: { show: true, title: 'Tela cheia' },
      center: { show: true, title: 'Centralizar', target: 'drawn' },
      measureArea: { show: true, title: 'Medir área' },
      measureLine: { show: true, title: 'Medir distância' },
      measurePolygon: { show: true, title: 'Medir polígono' },
      texts: {
        measureResult: 'Medição',
        measureLength: 'Distância',
        measureArea: 'Área',
        measureLineHelp: 'Clique em dois pontos no mapa. Duplo clique para finalizar.',
        measurePolygonHelp: 'Clique para adicionar vértices. Finalize no primeiro ponto, em Finalizar ou com duplo clique.',
        measureCancel: 'Cancelar',
        measureFinish: 'Finalizar medição'
      }
    },
    drawing: {
      show: true,
      translation: {
        lang: 'pt_br',
        customTexts: {
          tooltips: {
            placeMarker: 'Clique para posicionar o marcador',
            firstVertex: 'Clique para posicionar o primeiro vértice',
            continueLine: 'Clique para continuar desenhando',
            finishLine: 'Clique em qualquer marcador existente para finalizar',
            finishPoly: 'Clique no primeiro marcador para finalizar',
            finishRect: 'Clique para finalizar',
            startCircle: 'Clique para posicionar o centro do círculo',
            finishCircle: 'Clique para finalizar o círculo',
            placeCircleMarker: 'Clique para posicionar o marcador circular',
            placeText: 'Clique para inserir texto'
          },
          actions: {
            finish: 'Finalizar',
            cancel: 'Cancelar',
            removeLastVertex: 'Remover último vértice'
          },
          buttonTitles: {
            drawMarkerButton: 'Desenhar Marcador',
            drawPolyButton: 'Desenhar Polígonos',
            drawLineButton: 'Desenhar Linha Poligonal',
            drawCircleButton: 'Desenhar Círculo',
            drawRectButton: 'Desenhar Retângulo',
            editButton: 'Editar Camadas',
            dragButton: 'Arrastar Camadas',
            cutButton: 'Recortar Camadas',
            deleteButton: 'Remover Camadas',
            drawCircleMarkerButton: 'Desenhar Marcador de Círculo',
            snappingButton: 'Ajustar marcador arrastado a outras camadas e vértices',
            pinningButton: 'Unir vértices compartilhados',
            rotateButton: 'Rotacionar Camadas',
            drawTextButton: 'Desenhar Texto',
            scaleButton: 'Redimensionar Camadas',
            autoTracingButton: 'Traçado Automático de Linha'
          },
          measurements: {
            totalLength: 'Comprimento',
            segmentLength: 'Comprimento do Segmento',
            area: 'Área',
            radius: 'Raio',
            perimeter: 'Perímetro',
            height: 'Altura',
            width: 'Largura',
            coordinates: 'Posição',
            coordinatesMarker: 'Marcador de Posição'
          }
        }
      },
      options: {
        drawMarker: true,
        drawRectangle: true,
        drawPolyline: {
          color: '#ff0000',
          weight: 5,
          opacity: 0.5,
          stroke: true,
          fill: true,
          fillColor: '#ff0000',
          fillOpacity: 0.2
        },
        drawPolygon: true,
        drawCircle: true,
        drawCircleMarker: true,
        drawText: true,
        editMode: true,
        dragMode: true,
        cutPolygon: false,
        rotateMode: false,
        removalMode: true,
        drawControls: true,
        editControls: true,
        position: 'topright',
        positions: {
          draw: {
            position: 'topleft',
          },
          edit: {
            position: 'bottomright',
          },
        }
      }
    }
  }
}
```

## Desenvolvimento local

No repositório **core**, o `map_component` é consumido pelo frontend como pacote local (`file:./map_component`). Para alterar o componente:

```bash
cd map_component
npm install
npm run build
```

Em seguida, sincronize para o frontend (o `./start.sh` na raiz do core faz isso automaticamente via `rsync`, excluindo `.git` e `node_modules`).

### Marcadores estáveis no zoom

Opções em `options.map.config`:

| Opção | Descrição |
|-------|-----------|
| `markerZoomAnimation: false` | Desativa animação de marcadores no zoom (padrão no componente) |
| `stabilizeMarkersOnZoom: true` | Reposiciona marcadores após `zoomend` (evita drift de `divIcon`) |

Utilitários exportados pelo pacote (para consumidores que criam marcadores fora do fluxo interno):

```typescript
import { createStableMarker, bindMarkerZoomStability } from '@rural-environmental-registry/map_component'

const marker = createStableMarker(L, latlng, { icon: customDivIcon, layerCode: 'hq' })
```

O `LeafletMap` aplica `bindMarkerZoomStability` automaticamente no `drawItemsGroup` quando `stabilizeMarkersOnZoom` não é `false`.

### Dependências relevantes

| Pacote | Uso |
|--------|-----|
| `leaflet`, `@geoman-io/leaflet-geoman-free` | Mapa, desenho e medição |
| `@turf/turf` | Validação geométrica do shapefile |
| `shpjs` | Parse de shapefile em `.zip` no memorial descritivo |
| `papaparse` | Parse de CSV no memorial descritivo |
| `element-plus` | UI do painel de coordenadas |
