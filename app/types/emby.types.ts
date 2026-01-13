/** =====================
 *  EMBY BASE RESPONSE
 *  ===================== */
export interface EmbyListResponse<T> {
  Items: T[]
  TotalRecordCount?: number
}

/** =====================
 *  LIBRARY (CollectionFolder)
 *  ===================== */
export interface EmbyLibrary {
  Id: string
  Name: string
  Type: 'CollectionFolder'
  IsFolder: true
  ImageTags?: {
    Primary?: string
  }
}

/** =====================
 *  VIDEO ITEM
 *  ===================== */
export interface EmbyVideo {
  Id: string
  Name: string
  Type: 'Movie' | 'Video'
  MediaType: 'Video'
  RunTimeTicks?: number
  ImageTags?: {
    Primary?: string
  }
}
