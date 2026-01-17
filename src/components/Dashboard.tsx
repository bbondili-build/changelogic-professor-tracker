'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Professor, PipelineStatus, ActivityLog } from '@/lib/database.types'
import ProfessorCard from './ProfessorCard'
import ProfessorModal from './ProfessorModal'
import AddProfessorModal from './AddProfessorModal'
import {
  Search,
  Filter,
  LogOut,
  Shield,
  ShieldOff,
  Users,
  UserCheck,
  Briefcase,
  Trophy,
  AlertTriangle,
  Plus,
  RefreshCw
} from 'lucide-react'

const PIPELINE_STAGES: { status: PipelineStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { status: 'Identified', label: 'Identified', icon: <Users className="w-5 h-5" />, color: 'bg-slate-500' },
  { status: 'In Contact', label: 'In Contact', icon: <UserCheck className="w-5 h-5" />, color: 'bg-blue-500' },
  { status: 'First Lead', label: 'First Lead', icon: <Briefcase className="w-5 h-5" />, color: 'bg-amber-500' },
  { status: 'First Client', label: 'First Client', icon: <Trophy className="w-5 h-5" />, color: 'bg-emerald-500' },
]

export default function Dashboard() {
  const { isAdminMode, toggleAdminMode, logout } = useAuth()
  const [professors, setProfessors] = useState<Professor[]>([])
  const [activityLogs, setActivityLogs] = useState<Record<string, ActivityLog[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PipelineStatus | 'all'>('all')
  const [liaisonFilter, setLiaisonFilter] = useState<string>('all')
  const [showStaleOnly, setShowStaleOnly] = useState(false)
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: professorsData, error: professorsError } = await supabase
        .from('professors')
        .select('*')
        .order('name')

      if (professorsError) throw professorsError
      setProfessors(professorsData || [])

      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('date', { ascending: false })

      if (logsError) throw logsError

      const logsByProfessor: Record<string, ActivityLog[]> = {}
      logsData?.forEach((log) => {
        if (!logsByProfessor[log.professor_id]) {
          logsByProfessor[log.professor_id] = []
        }
        logsByProfessor[log.professor_id].push(log)
      })
      setActivityLogs(logsByProfessor)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const isStale = (professor: Professor): boolean => {
    if (!professor.last_contacted) return true
    const lastContact = new Date(professor.last_contacted)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastContact < thirtyDaysAgo
  }

  const filteredProfessors = useMemo(() => {
    return professors.filter((prof) => {
      const matchesSearch =
        searchQuery === '' ||
        prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.core_ip.some((ip) => ip.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || prof.status === statusFilter
      const matchesLiaison = liaisonFilter === 'all' || prof.liaison === liaisonFilter
      const matchesStale = !showStaleOnly || isStale(prof)

      return matchesSearch && matchesStatus && matchesLiaison && matchesStale
    })
  }, [professors, searchQuery, statusFilter, liaisonFilter, showStaleOnly])

  const pipelineCounts = useMemo(() => {
    const counts: Record<PipelineStatus, number> = {
      'Identified': 0,
      'In Contact': 0,
      'First Lead': 0,
      'First Client': 0,
    }
    professors.forEach((prof) => {
      counts[prof.status]++
    })
    return counts
  }, [professors])

  const staleCount = useMemo(() => {
    return professors.filter(isStale).length
  }, [professors])

  const uniqueLiaisons = useMemo(() => {
    const liaisons = new Set(professors.map((p) => p.liaison).filter((l) => l !== ''))
    return Array.from(liaisons).sort()
  }, [professors])

  const handleProfessorUpdate = (updated: Professor) => {
    setProfessors((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  const handleProfessorAdd = (newProfessor: Professor) => {
    setProfessors((prev) => [...prev, newProfessor].sort((a, b) => a.name.localeCompare(b.name)))
  }

  const handleActivityLogAdd = (professorId: string, log: ActivityLog) => {
    setActivityLogs((prev) => ({
      ...prev,
      [professorId]: [log, ...(prev[professorId] || [])],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading professors...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">ChangeLogic</h1>
              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-slate-500 text-sm hidden sm:inline">Professor Tracker</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleAdminMode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isAdminMode
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isAdminMode ? (
                  <>
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin Mode</span>
                  </>
                ) : (
                  <>
                    <ShieldOff className="w-4 h-4" />
                    <span className="hidden sm:inline">View Only</span>
                  </>
                )}
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pipeline Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {PIPELINE_STAGES.map((stage) => (
            <button
              key={stage.status}
              onClick={() => setStatusFilter(statusFilter === stage.status ? 'all' : stage.status)}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all hover:shadow-md ${
                statusFilter === stage.status
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${stage.color} text-white p-2 rounded-lg`}>
                  {stage.icon}
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-slate-800">{pipelineCounts[stage.status]}</p>
                  <p className="text-sm text-slate-500">{stage.label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stale Alert Banner */}
        {staleCount > 0 && (
          <button
            onClick={() => setShowStaleOnly(!showStaleOnly)}
            className={`w-full mb-6 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              showStaleOnly
                ? 'bg-red-100 text-red-700 border-2 border-red-300'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-2 border-transparent'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              {staleCount} professor{staleCount > 1 ? 's' : ''} not contacted in 30+ days
            </span>
            {showStaleOnly && <span className="text-sm">(click to show all)</span>}
          </button>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, institution, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PipelineStatus | 'all')}
                  className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All Stages</option>
                  {PIPELINE_STAGES.map((stage) => (
                    <option key={stage.status} value={stage.status}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={liaisonFilter}
                onChange={(e) => setLiaisonFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
              >
                <option value="all">All Liaisons</option>
                {uniqueLiaisons.map((liaison) => (
                  <option key={liaison} value={liaison}>
                    {liaison}
                  </option>
                ))}
              </select>

              {isAdminMode && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Professor</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing {filteredProfessors.length} of {professors.length} professors
          </p>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Professor Grid */}
        {filteredProfessors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No professors found</h3>
            <p className="text-slate-400">
              {professors.length === 0
                ? 'Add your first professor to get started'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfessors.map((professor) => (
              <ProfessorCard
                key={professor.id}
                professor={professor}
                isStale={isStale(professor)}
                onClick={() => setSelectedProfessor(professor)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Professor Detail Modal */}
      {selectedProfessor && (
        <ProfessorModal
          professor={selectedProfessor}
          activityLogs={activityLogs[selectedProfessor.id] || []}
          onClose={() => setSelectedProfessor(null)}
          onUpdate={handleProfessorUpdate}
          onActivityLogAdd={(log) => handleActivityLogAdd(selectedProfessor.id, log)}
          isStale={isStale(selectedProfessor)}
        />
      )}

      {/* Add Professor Modal */}
      {showAddModal && (
        <AddProfessorModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleProfessorAdd}
        />
      )}
    </div>
  )
}
