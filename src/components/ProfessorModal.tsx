'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Professor, ActivityLog, PipelineStatus, EngagementType, Liaison } from '@/lib/database.types'
import {
  X,
  Building2,
  Save,
  AlertTriangle,
  ExternalLink,
  Plus,
  Calendar,
  User,
  FileText,
  Briefcase,
  BookOpen,
  MessageSquare,
  Link as LinkIcon,
  CheckCircle,
  Trash2
} from 'lucide-react'

interface ProfessorModalProps {
  professor: Professor
  activityLogs: ActivityLog[]
  onClose: () => void
  onUpdate: (professor: Professor) => void
  onActivityLogAdd: (log: ActivityLog) => void
  isStale: boolean
}

const STATUS_OPTIONS: PipelineStatus[] = ['Identified', 'In Contact', 'First Lead', 'First Client']
const ENGAGEMENT_OPTIONS: EngagementType[] = ['Unknown', 'Hands Off', 'Open to Workshops', 'Open to Work', 'Open to be Staffed']
const LIAISON_OPTIONS: Liaison[] = ['', 'MKB', 'Vincent', 'Andy', 'Sara', 'Melanie', 'Emily', 'Lorenzo', 'Vanessa', 'Martin']

const STATUS_COLORS: Record<PipelineStatus, string> = {
  'Identified': 'bg-slate-100 text-slate-700 border-slate-300',
  'In Contact': 'bg-blue-100 text-blue-700 border-blue-300',
  'First Lead': 'bg-amber-100 text-amber-700 border-amber-300',
  'First Client': 'bg-emerald-100 text-emerald-700 border-emerald-300',
}

export default function ProfessorModal({
  professor,
  activityLogs,
  onClose,
  onUpdate,
  onActivityLogAdd,
  isStale,
}: ProfessorModalProps) {
  const { isAdminMode } = useAuth()
  const [formData, setFormData] = useState<Professor>(professor)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details')
  const [newLogEntry, setNewLogEntry] = useState('')
  const [newLogDate, setNewLogDate] = useState(new Date().toISOString().split('T')[0])
  const [addingLog, setAddingLog] = useState(false)

  // Array field inputs
  const [newIP, setNewIP] = useState('')
  const [newExecEd, setNewExecEd] = useState('')
  const [newClient, setNewClient] = useState('')

  useEffect(() => {
    setFormData(professor)
  }, [professor])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('professors')
        .update({
          name: formData.name,
          institution: formData.institution,
          role: formData.role,
          core_ip: formData.core_ip,
          exec_ed_programs: formData.exec_ed_programs,
          notes: formData.notes,
          status: formData.status,
          clients: formData.clients,
          liaison: formData.liaison,
          next_action: formData.next_action,
          contract_signed: formData.contract_signed,
          engagement_type: formData.engagement_type,
          links: formData.links,
          last_contacted: formData.last_contacted,
        })
        .eq('id', professor.id)
        .select()
        .single()

      if (error) throw error
      if (data) onUpdate(data)
    } catch (error) {
      console.error('Error saving professor:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddActivityLog = async () => {
    if (!newLogEntry.trim()) return
    setAddingLog(true)
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          professor_id: professor.id,
          date: newLogDate,
          entry: newLogEntry.trim(),
          created_by: formData.liaison || 'Team',
        })
        .select()
        .single()

      if (error) throw error

      // Update last_contacted
      const { data: updatedProf, error: updateError } = await supabase
        .from('professors')
        .update({ last_contacted: new Date().toISOString() })
        .eq('id', professor.id)
        .select()
        .single()

      if (updateError) throw updateError

      if (data) onActivityLogAdd(data)
      if (updatedProf) {
        setFormData(updatedProf)
        onUpdate(updatedProf)
      }

      setNewLogEntry('')
      setNewLogDate(new Date().toISOString().split('T')[0])
    } catch (error) {
      console.error('Error adding activity log:', error)
      alert('Failed to add activity log. Please try again.')
    } finally {
      setAddingLog(false)
    }
  }

  const addArrayItem = (field: 'core_ip' | 'exec_ed_programs' | 'clients', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }))
    setter('')
  }

  const removeArrayItem = (field: 'core_ip' | 'exec_ed_programs' | 'clients', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const updateLink = (key: keyof Professor['links'], value: string) => {
    setFormData(prev => ({
      ...prev,
      links: { ...prev.links, [key]: value }
    }))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-10">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {isAdminMode ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-xl font-bold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none bg-transparent"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-slate-800">{formData.name}</h2>
                )}
                {isStale && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    30+ days
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 className="w-4 h-4" />
                {isAdminMode ? (
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none bg-transparent"
                  />
                ) : (
                  <span>{formData.institution}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Activity Log ({activityLogs.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' ? (
              <div className="space-y-6">
                {/* Status & Key Info Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                    {isAdminMode ? (
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as PipelineStatus })}
                        className={`w-full px-3 py-2 rounded-lg border font-medium text-sm ${STATUS_COLORS[formData.status]}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-block px-3 py-2 rounded-lg border font-medium text-sm ${STATUS_COLORS[formData.status]}`}>
                        {formData.status}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Liaison</label>
                    {isAdminMode ? (
                      <select
                        value={formData.liaison}
                        onChange={(e) => setFormData({ ...formData, liaison: e.target.value as Liaison })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {LIAISON_OPTIONS.filter(l => l !== '').map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{formData.liaison || 'Unassigned'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Engagement</label>
                    {isAdminMode ? (
                      <select
                        value={formData.engagement_type}
                        onChange={(e) => setFormData({ ...formData, engagement_type: e.target.value as EngagementType })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      >
                        {ENGAGEMENT_OPTIONS.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm">{formData.engagement_type}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Contract Signed</label>
                    {isAdminMode ? (
                      <button
                        onClick={() => setFormData({ ...formData, contract_signed: !formData.contract_signed })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          formData.contract_signed
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {formData.contract_signed ? 'Yes' : 'No'}
                      </button>
                    ) : (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        formData.contract_signed ? 'text-green-700' : 'text-slate-500'
                      }`}>
                        <CheckCircle className="w-4 h-4" />
                        {formData.contract_signed ? 'Signed' : 'Not signed'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Core IP */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <BookOpen className="w-4 h-4" />
                    Core IP / Expertise
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.core_ip.map((ip, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {ip}
                        {isAdminMode && (
                          <button onClick={() => removeArrayItem('core_ip', idx)} className="hover:text-indigo-900">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isAdminMode && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newIP}
                        onChange={(e) => setNewIP(e.target.value)}
                        placeholder="Add expertise..."
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && addArrayItem('core_ip', newIP, setNewIP)}
                      />
                      <button
                        onClick={() => addArrayItem('core_ip', newIP, setNewIP)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Exec Ed Programs */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Briefcase className="w-4 h-4" />
                    Executive Education Programs
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.exec_ed_programs.map((prog, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {prog}
                        {isAdminMode && (
                          <button onClick={() => removeArrayItem('exec_ed_programs', idx)} className="hover:text-slate-900">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isAdminMode && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newExecEd}
                        onChange={(e) => setNewExecEd(e.target.value)}
                        placeholder="Add program..."
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && addArrayItem('exec_ed_programs', newExecEd, setNewExecEd)}
                      />
                      <button
                        onClick={() => addArrayItem('exec_ed_programs', newExecEd, setNewExecEd)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Clients */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Briefcase className="w-4 h-4" />
                    Clients in Pipeline
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.clients.length === 0 ? (
                      <span className="text-sm text-slate-400">No clients yet</span>
                    ) : (
                      formData.clients.map((client, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                          {client}
                          {isAdminMode && (
                            <button onClick={() => removeArrayItem('clients', idx)} className="hover:text-emerald-900">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </span>
                      ))
                    )}
                  </div>
                  {isAdminMode && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newClient}
                        onChange={(e) => setNewClient(e.target.value)}
                        placeholder="Add client..."
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && addArrayItem('clients', newClient, setNewClient)}
                      />
                      <button
                        onClick={() => addArrayItem('clients', newClient, setNewClient)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </label>
                  {isAdminMode ? (
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                      placeholder="Add notes..."
                    />
                  ) : (
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                      {formData.notes || 'No notes yet'}
                    </p>
                  )}
                </div>

                {/* Next Action */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Next Action
                  </label>
                  {isAdminMode ? (
                    <input
                      type="text"
                      value={formData.next_action}
                      onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="What's the next step?"
                    />
                  ) : (
                    <p className="text-sm text-slate-600 bg-amber-50 rounded-lg p-3 border border-amber-200">
                      {formData.next_action || 'No next action set'}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <LinkIcon className="w-4 h-4" />
                    Links
                  </label>
                  {isAdminMode ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData.links.faculty_page || ''}
                        onChange={(e) => updateLink('faculty_page', e.target.value)}
                        placeholder="Faculty page URL"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <input
                        type="url"
                        value={formData.links.google_scholar || ''}
                        onChange={(e) => updateLink('google_scholar', e.target.value)}
                        placeholder="Google Scholar URL"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <input
                        type="url"
                        value={formData.links.linkedin || ''}
                        onChange={(e) => updateLink('linkedin', e.target.value)}
                        placeholder="LinkedIn URL"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.links.faculty_page && (
                        <a href={formData.links.faculty_page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors">
                          Faculty Page <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {formData.links.google_scholar && (
                        <a href={formData.links.google_scholar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors">
                          Google Scholar <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {formData.links.linkedin && (
                        <a href={formData.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors">
                          LinkedIn <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {!formData.links.faculty_page && !formData.links.google_scholar && !formData.links.linkedin && (
                        <span className="text-sm text-slate-400">No links added</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Activity Log Tab */
              <div className="space-y-4">
                {/* Add new log entry */}
                {isAdminMode && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Add Activity Entry</h4>
                    <div className="flex gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={newLogDate}
                          onChange={(e) => setNewLogDate(e.target.value)}
                          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                    <textarea
                      value={newLogEntry}
                      onChange={(e) => setNewLogEntry(e.target.value)}
                      rows={2}
                      placeholder="What happened? (e.g., Had intro call, Sent proposal, etc.)"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-3"
                    />
                    <button
                      onClick={handleAddActivityLog}
                      disabled={!newLogEntry.trim() || addingLog}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {addingLog ? 'Adding...' : 'Add Entry'}
                    </button>
                  </div>
                )}

                {/* Log entries list */}
                {activityLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No activity logged yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          {log.created_by && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span>{log.created_by}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-slate-700">{log.entry}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {isAdminMode && activeTab === 'details' && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
