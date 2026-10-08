import { MapOptions, Layer, PathOptions, ControlOptions, ControlPosition } from 'leaflet'
import { GeoJsonObject } from 'geojson'

// @ts-ignore
import { PM } from '@geoman-io/leaflet-geoman-free'

export type FaIconName =
  | 'check'
  | 'xmark'
  | 'chevron-right'
  | 'chevron-left'
  | 'terminal'
  | 'file-lines'
  | 'upload'
  | 'pencil'
  | 'trash'
  | 'chevron-down'
  | 'eye'
  | 'eye-slash'
  | 'circle-info'
  | 'circle-exclamation'
  | 'triangle-exclamation'
  | 'circle-check'
  | 'circle-xmark'
  | 'ban'
  | 'lock'
  | 'unlock'
  | 'thumbtack'
  | 'thumb-tack'
  | 'map-pin'

export type DrawnArea = {
  m2: number
  km2: number
  ha: number
}

export type IncrementedLayer = Layer & { drawnArea: DrawnArea }

export type LayerActionStyle = {
  backgroundColor: string
  color: string
  borderColor?: string
}

export type LayerActionDefaultItem = {
  key?: string
  name: string
  icon?: FaIconName
  style?: LayerActionStyle
  disabled?: boolean
  visible?: boolean
}

export type LayerActionDefaults = {
  edit?: LayerActionDefaultItem
  import?: LayerActionDefaultItem
  delete?: LayerActionDefaultItem
  cancel?: LayerActionDefaultItem
  conclude?: LayerActionDefaultItem
}

export type LayerActionConfig = {
  key: string
  name: string
  icon?: FaIconName
  type?: 'edit' | 'import' | 'delete' | 'visibility' | 'custom' | 'cancel' | 'conclude'
  disabled?: boolean
  visible?: boolean
  style?: LayerActionStyle
}

export type LayerMetricsConfig = {
  title: string
  type: string
  value: string | number
  style?: LayerActionStyle
}

/** @deprecated Use LayerMetricsConfig */
export type LayerMetrics = LayerMetricsConfig

export type LayerMetricsMap = Record<string, LayerMetricsConfig[]>

export type LayerInfoIconConfig = {

  key?: string
  icon: FaIconName
  active: boolean
  tooltip?: string
  style?: Partial<Pick<LayerActionStyle, 'color' | 'backgroundColor'>>
}

export type LayerInfoIconsMap = Record<string, LayerInfoIconConfig[]>

export type GroupActionConfig = LayerActionConfig & {
  active: boolean
}


export type GroupActionsMap = Record<string, GroupActionConfig[]>

export type SectionConfig = {
  name?: string
  key: string
  groups: GroupLayerData[]
  actionDefaults?: LayerActionDefaults
}

/** @deprecated Use SectionConfig */
export type SectionData = SectionConfig

export type LayerData = {
  key: string
  name: string
  active: boolean
  activeDefault: boolean
  tooltip?: string
  toggle?: {
    active: string
    inactive: string
  }
  visibility?: {
    labelShow?: string
    labelHide?: string
    show?: boolean
  }
  style?: {
    color: string
    fillColor: string
    icon?: string
  }
  baseUrl?: string
  layers?: string
  format?: string
  transparent?: boolean
  geojson?: GeoJsonObject | GeoJsonObject[]
  cqlFilter?: string
  options?: Record<string, unknown>

  mapSource?: 'wms' | 'geojson' | 'none' | 'consumer'
  actions?: LayerActionConfig[]
  metrics?: LayerMetricsConfig[]
  infoIcons?: LayerInfoIconConfig[]
  required?: boolean
  editActions?: LayerActionConfig[]
  meta?: Record<string, unknown>
}

export type GroupLayerData = {
  name: string
  key: string
  toggle?: {
    active: string
    inactive: string
  }
  visibility?: {
    show?: boolean
    labelShow?: string
    labelHide?: string
  }
  collapsed?: boolean
  actions?: GroupActionConfig[]
  layers: LayerData[]
  meta?: Record<string, unknown>
}

export type LayersConfig = GroupLayerData[] | SectionConfig[]

export type LayerActionPayload = {
  actionKey: string
  actionType?: LayerActionConfig['type']
  sectionKey?: string
  groupKey?: string
  layerKey?: string
  layer?: LayerData
  source: 'child-menu' | 'edit-panel' | 'group-menu'
}

export type SectionEditStatePayload = {
  sectionKey: string | null
  layerKey: string | null
  layer: LayerData | null
}

export type SectionSelectPayload = {
  sectionKey: string
}

export type DrawingEvent = {
  type: 'created' | 'edited' | 'deleted'
  layer: IncrementedLayer
}

export type BaseMapLayer = {
  name: string
  key: string
  default: boolean
  url: string
  tms?: boolean
  minZoom?: number
  maxZoom?: number
  maxNativeZoom?: number
  errorTileUrl?: string
  minZoomWarning?: number | null
}

export type BaseMapLayers = BaseMapLayer[]

export type MapLayers = {
  mapLayers: BaseMapLayers
  customLayers?: LayersConfig
}

export type MapConfigConfig = MapOptions & {
  id: string
  removeControlLayers?: boolean
  zoomControlPosition?: ControlPosition
  stabilizeMarkersOnZoom?: boolean
}

export type MapConfig = {
  config?: MapConfigConfig
}

export type LayersMenuConfig = {
  size: 'small' | 'medium' | 'large'
  removeMenu?: boolean
  persist: boolean
  editingLayerKey?: string | null
  selectedSectionKey?: string | null
  visibilityMode?: 'switch' | 'eye'
  defaultOpen?: boolean
}

export type MemorialConfig = {
  show: boolean
  config?: any
  controlTexts?: any
}

export type MapToolsConfig = {
  show?: boolean
  position?: ControlPosition
  zoom?: { show?: boolean; titleIn?: string; titleOut?: string }
  fullscreen?: { show?: boolean; title?: string }
  center?: {
    show?: boolean
    title?: string
    target?: 'drawn' | 'initial'
    padding?: [number, number]
  }
  measureArea?: {
    show?: boolean
    title?: string
    shapeOptions?: PathOptions
  }
  measureLine?: {
    show?: boolean
    title?: string
  }
  measurePolygon?: {
    show?: boolean
    title?: string
  }
  showInteractionPanel?: boolean
  texts?: {
    measureResult?: string
    measureLength?: string
    measureArea?: string
    measureCancel?: string
    measureFinish?: string
    measurePanelTitle?: string
    measureLineTitle?: string
    measurePolygonTitle?: string
    measureLineHelp?: string
    measurePolygonHelp?: string
    noGeometry?: string
  }
}

export type MeasureCompleteEvent = {
  m2?: number
  km2?: number
  ha?: number
  lengthM?: number
  lengthKm?: number
  geojson: GeoJsonObject
}

export type MapOptionsConfig = {
  layersMenu?: LayersMenuConfig
  map: MapConfig
  drawing?: DrawingConfig
  tools?: MapToolsConfig
}

export type DrawingConfig = DrawingControlOptions & DisplayDrawingControl

export type TranslationConfig = {
  lang?: PM.SupportLocales
  customTexts?: PM.Translations
}

export type GeomanDrawingEvent = {
  shape: PM.SUPPORTED_SHAPES
  layer: Layer
  [key: string]: any
}

export type ToolbarOptions = {
  [K in PM.ToolbarOptions]: ControlOptions | PM.BlockPositions | boolean | PathOptions | undefined
}

export type PMToolbarOptions = PM.ToolbarOptions

export type DrawingControlOptions = {
  options: ToolbarOptions
  translation: TranslationConfig
}

type DisplayDrawingControl = {
  show: boolean
}

export type PMSupportedShapes = PM.SUPPORTED_SHAPES

export type CoordinatePanelTexts = {
  title?: string
  addPoint?: string
  editPoint?: string
  removePoint?: string
  actions?: string
  clearGeometries?: string
  index?: string
  x?: string
  y?: string
  azimuth?: string
  distance?: string
  noPoints?: string
  addPointTitle?: string
  editPointTitle?: string
  removePointTitle?: string
  clearGeometriesTitle?: string
  addPointDescription?: string
  editPointDescription?: string
  removePointDescription?: string
  clearGeometriesDescription?: string
  memorialDescriptive?: string
  referenceSystem?: string
  selectSystem?: string
  sirgas2000?: string
  coordinateFormat?: string
  selectFormat?: string
  decimalDegrees?: string
  degreesMinutesSeconds?: string
  manualInput?: string
  insertCoordinates?: string
  xLongitude?: string
  yLatitude?: string
  degrees?: string
  minutes?: string
  seconds?: string
  addedPoints?: string
  finalizeGeometry?: string
  csvUpload?: string
  csvFileUpload?: string
  dragCsvFile?: string
  csvColumnsInfo?: string
  applyCsvCoordinates?: string
  shapefileUpload?: string
  shapefileFileUpload?: string
  dragShapefileZip?: string
  shapefileZipInfo?: string
  shapefileAppliedSuccess?: string
  geometryImportUnsupportedFormat?: string
  placeholderLongitude?: string
  placeholderLatitude?: string
  placeholderAzimuth?: string
  placeholderDistance?: string
  placeholderDegrees?: string
  placeholderMinutes?: string
  placeholderSeconds?: string
  errorXYRequired?: string
  errorDegreesRequired?: string
  errorFirstRowXY?: string
  errorProvideCoordinatesOrAzimuthDistance?: string
}

export type DescriptiveMemorial = {
  show: boolean
  customTexts?: CoordinatePanelTexts
}
