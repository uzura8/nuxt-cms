export interface CategoryPublic {
  id: number
  slug: string
  serviceId: string
  label: string
  parentPath: string
  children?: CategoryPublic[]
}

export interface ApiListParamsCategory {
  withParent?: boolean
  subScope?: string
  apiVer?: number
}
