export type PipelineStatus = 'Identified' | 'In Contact' | 'First Lead' | 'First Client'

export type EngagementType =
  | 'Unknown'
  | 'Hands Off'
  | 'Open to Workshops'
  | 'Open to Work'
  | 'Open to be Staffed'

export type Liaison =
  | ''
  | 'MKB'
  | 'Vincent'
  | 'Andy'
  | 'Sara'
  | 'Melanie'
  | 'Emily'
  | 'Lorenzo'
  | 'Vanessa'
  | 'Martin'

export interface ProfessorLinks {
  faculty_page?: string
  google_scholar?: string
  linkedin?: string
  other?: string
}

export interface Professor {
  id: string
  name: string
  institution: string
  role: string
  core_ip: string[]
  exec_ed_programs: string[]
  notes: string
  status: PipelineStatus
  clients: string[]
  liaison: Liaison
  next_action: string
  contract_signed: boolean
  engagement_type: EngagementType
  links: ProfessorLinks
  last_contacted: string | null
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  professor_id: string
  date: string
  entry: string
  created_by: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      professors: {
        Row: Professor
        Insert: {
          name: string
          institution: string
          role?: string
          core_ip?: string[]
          exec_ed_programs?: string[]
          notes?: string
          status: string
          clients?: string[]
          liaison?: string
          next_action?: string
          contract_signed?: boolean
          engagement_type?: string
          links?: ProfessorLinks
          last_contacted?: string | null
        }
        Update: {
          name?: string
          institution?: string
          role?: string
          core_ip?: string[]
          exec_ed_programs?: string[]
          notes?: string
          status?: string
          clients?: string[]
          liaison?: string
          next_action?: string
          contract_signed?: boolean
          engagement_type?: string
          links?: ProfessorLinks
          last_contacted?: string | null
        }
      }
      activity_logs: {
        Row: ActivityLog
        Insert: {
          professor_id: string
          date: string
          entry: string
          created_by?: string
        }
        Update: {
          professor_id?: string
          date?: string
          entry?: string
          created_by?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
