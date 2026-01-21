'use client'

import React from 'react'
import { Professor, PipelineStatus, ActivityLog } from '@/lib/database.types'
import { Building2, AlertTriangle, User, CheckCircle, Calendar } from 'lucide-react'

interface ProfessorCardProps {
  professor: Professor
  activityLogs: ActivityLog[]
  isStale: boolean
  onClick: () => void
}

const STATUS_COLORS: Record<PipelineStatus, string> = {
  'Identified': 'bg-slate-100 text-slate-700',
  'In Contact': 'bg-blue-100 text-blue-700',
  'First Lead': 'bg-amber-100 text-amber-700',
  'First Client': 'bg-emerald-100 text-emerald-700',
}

export default function ProfessorCard({ professor, activityLogs, isStale, onClick }: ProfessorCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-left hover:shadow-md hover:border-slate-300 transition-all w-full"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{professor.name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{professor.institution}</span>
          </div>
        </div>
        {isStale && (
          <div className="flex-shrink-0" title="Not contacted in 30+ days">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[professor.status]}`}>
          {professor.status}
        </span>
        {professor.contract_signed && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Signed
          </span>
        )}
      </div>

      {professor.core_ip.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {professor.core_ip.slice(0, 3).map((ip, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
              {ip}
            </span>
          ))}
          {professor.core_ip.length > 3 && (
            <span className="px-2 py-0.5 text-slate-400 text-xs">
              +{professor.core_ip.length - 3} more
            </span>
          )}
        </div>
      )}

      {professor.liaison && (
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <User className="w-3.5 h-3.5" />
          <span>{professor.liaison}</span>
        </div>
      )}

      {activityLogs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Activity Log
          </div>
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {activityLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="text-xs text-slate-600">
                <span className="text-slate-400">
                  {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:
                </span>{' '}
                <span className="line-clamp-1">{log.entry}</span>
              </div>
            ))}
            {activityLogs.length > 3 && (
              <div className="text-xs text-slate-400">+{activityLogs.length - 3} more</div>
            )}
          </div>
        </div>
      )}
    </button>
  )
}
