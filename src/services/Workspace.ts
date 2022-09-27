export interface ListWorkspaceReq {
  agentCodes: string[]
  dataType: number
  dateType: number
  domestic: boolean
  orgCode?: string
}

export interface ListWorkspaceRes {
  agentCodes: string[]
  dataType: number
  dateType: number
  domestic: boolean
  orgCode?: string
}
