export interface StatChanges {
  Knowledge?: number
  Expression?: number
  Diligence?: number
  Understanding?: number
  Courage?: number
}

export interface Activity {
  date: string
  timeOfDay: "Morning" | "Afternoon" | "Evening"
  activity: string
  activityType?: "Study" | "Social" | "Work" | "Training" | "Reading" | "Rest" | string
  details?: string
  weather?: "Sunny" | "Rainy" | "Cloudy"
  statChanges?: StatChanges
}

export interface Stats {
  Knowledge: number
  Expression: number
  Diligence: number
  Understanding: number
  Courage: number
}

export interface DataType {
  activities: Activity[]
  stats: Stats
}
