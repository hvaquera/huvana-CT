'use client';

import { useState } from 'react';
import {
  AlertTriangle, CheckCircle, Clock, Plus, FileText,
  Building2, Users, Briefcase, ChevronDown, ChevronUp, X
} from 'lucide-react';

type RequirementType = 'SAT' | 'Municipio' | 'Cliente' | 'IMSS' | 'Interno';
type RequirementStatus = 'verde' | 'amarillo' | 'rojo' | 'vencido';
type RequirementArea = 'Legal' | 'Operaciones' | 'Cuentas' | 'Campo' | 'Dirección';

interface Requirement {
  id: string;
  tipo: RequirementType;
  descripcion: string;
  fechaRecibido: string;
  area: RequirementArea;
  sla: string;
  diasRestantes: number;
  status: RequirementStatus;
  responsable: string;
  notas?: string;
}

const DEMO_REQUIREMENTS: Requirement[] = [
  {
    id: '1',
    tipo: 'SAT',
    descripcion: 'Revisión de CFDI 2024 — Complementos de pago pendientes',
    fechaRecibido: '2026-05-10',
    area: 'Legal',
    sla: '8 días',
    diasRestantes: 8,
    status: 'amarillo',
    responsable: 'Lic. García',
    notas: 'Requiere validación de 47 facturas Q4 2024'
  },
  {
    id: '2',
    tipo: 'Municipio',
    descripcion: 'Permiso instalación espectacular Av. Constitución #450',
    fechaRecibido: '2026-05-18',
    area: 'Operaciones',
    sla: '3 días',
    diasRestantes: 3,
    status: 'rojo',
    responsable: 'Ing. Martínez',
    notas: 'Municipio MTY — Dirección de Obras Públicas — urgente'
  },
  {
    id: '3',
    tipo: 'Cliente',
    descripcion: 'Reporte de campaña Q1 — Grupo Bimbo Nacional',
    fechaRecibido: '2026-05-06',
    area: 'Cuentas',
    sla: '15 días',
    diasRestantes: 15,
    status: 'verde',
    responsable: 'Daniela Romo',
    notas: 'Incluir métricas de impresiones y OTS por punto'
  },
  {
    id: '4',
    tipo: 'SAT',
    descripcion: 'Declaración anual complementaria — Ajuste ISR 2023',
    fechaRecibido: '2026-04-30',
    area: 'Legal',
    sla: 'Vencido',
    diasRestantes: -5,
    status: 'vencido',
    responsable: 'Lic. García',
    notas: 'Requiere atención inmediata — posible multa $45,000'
  },
  {
    id: '5',
    tipo: 'Municipio',
    descripcion: 'Renovación licencia uso de suelo — 12 ubicaciones zona norte',
    fechaRecibido: '2026-05-15',
    area: 'Operaciones',
    sla: '21 días',
    diasRestantes: 21,
    status: 'verde',
    responsable: 'Ing. Martínez',
    notas: 'Municipios: MTY, Guadalupe, San Nicolás'
  },
  {
    id: '6',
    tipo: 'Cliente',
    descripcion: 'Contrato renovación anual — OXXO Región Norte',
    fechaRecibido: '2026-05-19',
    area: 'Cuentas',
    sla: '5 días',
    diasRestantes: 5,
    status: 'amarillo',
    responsable: 'Carlos Vela',
    notas: '847 puntos activos — renovación $2.4M anuales'
  },
];

const statusConfig = {
  verde: {
    label: 'En tiempo',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
  },
  amarillo: {
    label: 'En riesgo',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  rojo: {
    label: 'Crítico',
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    dot: 'bg-red-500',
    icon: AlertTriangle,
  },
  vencido: {
    label: 'Vencido',
    color: 'text-red-900',
    bg: 'bg-red-200',
    border: 'border-red-400',
    dot: 'bg-red-800',
    icon: AlertTriangle,
  },
};

const tipoConfig: Record<RequirementType, { color: string; bg: string; icon: React.ComponentType<{className?: string}> }> = {
  SAT:       { color: 'text-purple-700', bg: 'bg-purple-100', icon: FileText },
  Municipio: { color: 'text-blue-700',   bg: 'bg-blue-100',   icon: Building2 },
  Cliente:   { color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Users },
  IMSS:      { color: 'text-orange-700', bg: 'bg-orange-100', icon: FileText },
  Interno:   { color: 'text-slate-700',  bg: 'bg-slate-100',  icon: Briefcase },
};

interface NewReqModalProps {
  onClose: () => void;
}

function NewReqModal({ onClose }: NewReqModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 text-lg">Nuevo Requerimiento</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Tipo</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400">
                <option>SAT</option>
                <option>Municipio</option>
                <option>Cliente</option>
                <option>IMSS</option>
                <option>Interno</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Área asignada</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400">
                <option>Legal</option>
                <option>Operaciones</option>
                <option>Cuentas</option>
                <option>Campo</option>
                <option>Dirección</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Descripción</label>
            <input type="text" placeholder="Describe el requerimiento..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Fecha recibido</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Fecha límite SLA</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Responsable</label>
            <input type="text" placeholder="Nombre del responsable..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Notas adicionales</label>
            <textarea rows={2} placeholder="Contexto, documentos requeridos, etc." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700">
            Guardar Requerimiento
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComplianceTracker() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterTipo, setFilterTipo] = useState<string>('Todos');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [showModal, setShowModal] = useState(false);

  const activos = DEMO_REQUIREMENTS.filter(r => r.status !== 'vencido').length;
  const enRiesgo = DEMO_REQUIREMENTS.filter(r => r.status === 'rojo' || r.status === 'amarillo').length;
  const vencidos = DEMO_REQUIREMENTS.filter(r => r.status === 'vencido').length;

  const filtered = DEMO_REQUIREMENTS.filter(r => {
    if (filterTipo !== 'Todos' && r.tipo !== filterTipo) return false;
    if (filterStatus !== 'Todos' && r.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => a.diasRestantes - b.diasRestantes);

  return (
    <div className="space-y-4">
      {showModal && <NewReqModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Requerimientos & Compliance</h2>
          <p className="text-xs text-slate-400 mt-0.5">SAT · Municipios · Clientes — control total de SLAs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo Requerimiento
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{activos}</div>
          <div className="text-xs text-slate-400 mt-0.5">Requerimientos activos</div>
        </div>
        <div className={`rounded-xl border p-4 text-center ${enRiesgo > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
          <div className={`text-2xl font-bold ${enRiesgo > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{enRiesgo}</div>
          <div className="text-xs text-slate-400 mt-0.5">En riesgo / críticos</div>
        </div>
        <div className={`rounded-xl border p-4 text-center ${vencidos > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className={`text-2xl font-bold ${vencidos > 0 ? 'text-red-700' : 'text-slate-900'}`}>{vencidos}</div>
          <div className="text-xs text-slate-400 mt-0.5">Vencidos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {['Todos', 'SAT', 'Municipio', 'Cliente'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTipo(t)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${filterTipo === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {['Todos', 'vencido', 'rojo', 'amarillo', 'verde'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all capitalize ${filterStatus === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {s === 'Todos' ? 'Todos' : s === 'vencido' ? '🔴 Vencido' : s === 'rojo' ? '🔴 Crítico' : s === 'amarillo' ? '🟡 Riesgo' : '🟢 OK'}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements list */}
      <div className="space-y-2">
        {filtered.map(req => {
          const sCfg = statusConfig[req.status];
          const tCfg = tipoConfig[req.tipo];
          const StatusIcon = sCfg.icon;
          const TipoIcon = tCfg.icon;
          const isExpanded = expanded === req.id;

          return (
            <div
              key={req.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                req.status === 'vencido' ? 'border-red-300' :
                req.status === 'rojo' ? 'border-red-200' :
                req.status === 'amarillo' ? 'border-amber-200' :
                'border-slate-200'
              }`}
            >
              <div
                onClick={() => setExpanded(isExpanded ? null : req.id)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {/* Status dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sCfg.dot} ${req.status === 'vencido' || req.status === 'rojo' ? 'animate-pulse' : ''}`} />

                {/* Tipo badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 flex items-center gap-1 ${tCfg.bg} ${tCfg.color}`}>
                  <TipoIcon className="h-2.5 w-2.5" />
                  {req.tipo}
                </span>

                {/* Description */}
                <span className="flex-1 text-sm font-medium text-slate-800 truncate">{req.descripcion}</span>

                {/* Area */}
                <span className="text-xs text-slate-400 hidden sm:block flex-shrink-0">{req.area}</span>

                {/* SLA */}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${sCfg.bg} ${sCfg.color}`}>
                  {req.status === 'vencido' ? `${Math.abs(req.diasRestantes)}d vencido` : req.sla}
                </span>

                {/* Status */}
                <span className={`text-[10px] font-semibold flex items-center gap-1 flex-shrink-0 ${sCfg.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {sCfg.label}
                </span>

                {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />}
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium mb-0.5">RESPONSABLE</p>
                    <p className="text-sm font-medium text-slate-800">{req.responsable}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium mb-0.5">ÁREA</p>
                    <p className="text-sm font-medium text-slate-800">{req.area}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium mb-0.5">RECIBIDO</p>
                    <p className="text-sm font-medium text-slate-800">{new Date(req.fechaRecibido).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium mb-0.5">SLA</p>
                    <p className={`text-sm font-bold ${sCfg.color}`}>{req.sla}</p>
                  </div>
                  {req.notas && (
                    <div className="col-span-2 sm:col-span-4">
                      <p className="text-[10px] text-slate-400 font-medium mb-0.5">NOTAS</p>
                      <p className="text-sm text-slate-600">{req.notas}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />En tiempo — más de 10 días</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />En riesgo — 6 a 10 días</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />Crítico — menos de 5 días</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-800" />Vencido — requiere acción inmediata</span>
      </div>
    </div>
  );
}
