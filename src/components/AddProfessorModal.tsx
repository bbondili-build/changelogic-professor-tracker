'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Professor, PipelineStatus, EngagementType, Liaison } from '@/lib/database.types'
import { X, Plus, Save, Building2, User } from 'lucide-react'

interface AddProfessorModalProps {
  onClose: () => void
  onAdd: (professor: Professor) => void
}

const STATUS_OPTIONS: PipelineStatus[] = ['Identified', 'In Contact', 'First Lead', 'First Client']
const ENGAGEMENT_OPTIONS: EngagementType[] = ['Unknown', 'Hands Off', 'Open to Workshops', 'Open to Work', 'Open to be Staffed']
const LIAISON_OPTIONS: Liaison[] = ['', 'BB', 'Vincent', 'Andy', 'Sara', 'Melanie', 'Emily', 'Lorenzo', 'Vanessa', 'Martin']

export default function AddProfessorModal({ onClose, onAdd }: AddProfessorModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    role: 'Professor',
    status: 'Identified' as PipelineStatus,
    liaison: '' as Liaison,
    engagement_type: 'Unknown' as EngagementType,
    notes: '',
    next_action: '',
  })

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.institution.trim()) {
      alert('Please enter a name and institution')
      return
    }

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('professors')
        .insert({
          name: formData.name.trim(),
          institution: formData.institution.trim(),
          role: formData.role,
          status: formData.status,
          liaison: formData.liaison,
          engagement_type: formData.engagement_type,
          notes: formData.notes,
          next_action: formData.next_action,
          core_ip: [],
          exec_ed_programs: [],
          clients: [],
          contract_signed: false,
          links: {},
          last_contacted: null,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        onAdd(data)
        onClose()
      }
    } catch (error) {
      console.error('Error adding professor:', error)
      alert('Failed to add professor. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Add New Professor</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Professor name"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Institution <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Business school / University"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PipelineStatus })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Liaison</label>
                <select
                  value={formData.liaison}
                  onChange={(e) => setFormData({ ...formData, liaison: e.target.value as Liaison })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">Unassigned</option>
                  {LIAISON_OPTIONS.filter(l => l !== '').map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Engagement Type</label>
              <select
                value={formData.engagement_type}
                onChange={(e) => setFormData({ ...formData, engagement_type: e.target.value as EngagementType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {ENGAGEMENT_OPTIONS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Background, connections, observations..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Next Action</label>
              <input
                type="text"
                value={formData.next_action}
                onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                placeholder="What's the first step?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.name.trim() || !formData.institution.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Adding...' : 'Add Professor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
