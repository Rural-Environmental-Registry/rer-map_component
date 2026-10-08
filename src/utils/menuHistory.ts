import { LayerData } from '../types'

const MENU_HISTORY_KEY = 'menuHistory'
const MENU_COLLAPSE_KEY = 'menuCollapseHistory'

const readJsonObject = (storageKey: string): Record<string, boolean> => {
  try {
    const raw = window.sessionStorage.getItem(storageKey)
    if (!raw) return {}

    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {}
    }

    return parsed as Record<string, boolean>
  } catch {
    return {}
  }
}

const writeJsonObject = (storageKey: string, value: Record<string, boolean>): void => {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
  }
}

export const setHistory = (layer: LayerData): void => {
  const history = readJsonObject(MENU_HISTORY_KEY)
  writeJsonObject(MENU_HISTORY_KEY, { ...history, [layer.key]: layer.active })
}

export const getHistory = (layerKey: string): boolean | undefined => {
  const history = readJsonObject(MENU_HISTORY_KEY)
  const isActive = history[layerKey]
  return isActive !== undefined ? isActive : undefined
}

export const setGroupCollapsedHistory = (groupKey: string, collapsed: boolean): void => {
  const history = readJsonObject(MENU_COLLAPSE_KEY)
  writeJsonObject(MENU_COLLAPSE_KEY, { ...history, [groupKey]: collapsed })
}

export const getGroupCollapsedHistory = (groupKey: string): boolean | undefined => {
  const history = readJsonObject(MENU_COLLAPSE_KEY)
  const collapsed = history[groupKey]
  return collapsed !== undefined ? collapsed : undefined
}

export const resolveLayerActiveState = (layer: LayerData, persist: boolean): LayerData => {
  const savedActive = persist ? getHistory(layer.key) : undefined

  let active = layer.active ?? false
  let activeDefault = layer.activeDefault

  if (savedActive !== undefined) {
    active = savedActive
    activeDefault = savedActive
  }

  if (activeDefault) {
    active = activeDefault
  }

  return { ...layer, active, activeDefault }
}

export const resolveGroupCollapsedState = (
  groupKey: string,
  collapsedFromConfig: boolean | undefined,
  persist: boolean
): boolean => {
  if (persist) {
    const saved = getGroupCollapsedHistory(groupKey)
    if (saved !== undefined) return saved
  }
  return collapsedFromConfig ?? false
}

export const shouldInitLayerOnMap = (layer: LayerData, persist: boolean): boolean => {
  const resolved = resolveLayerActiveState(layer, persist)

  if (resolved.activeDefault) return true

  return persist && getHistory(layer.key) !== undefined
}
