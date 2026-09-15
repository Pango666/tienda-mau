import { useState, useEffect, useCallback } from 'react'
import {
  fetchAllDeliveryPoints,
  createDeliveryPoint,
  updateDeliveryPoint,
  deleteDeliveryPoint,
} from '../services/adminService'
import type { DeliveryPoint } from '../../../types'

export default function AdminDeliveryPage() {
  const [points, setPoints] = useState<DeliveryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPoint, setEditingPoint] = useState<DeliveryPoint | null>(null)

  const [form, setForm] = useState({
    name: '',
    address: '',
    schedule: '',
    maps_url: '',
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    const data = await fetchAllDeliveryPoints()
    setPoints(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  function openCreate() {
    setEditingPoint(null)
    setForm({ name: '', address: '', schedule: '', maps_url: '' })
    setShowModal(true)
  }

  function openEdit(point: DeliveryPoint) {
    setEditingPoint(point)
    setForm({
      name: point.name,
      address: point.address,
      schedule: point.schedule || '',
      maps_url: point.maps_url || '',
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.address) return

    let ok: boolean
    if (editingPoint) {
      ok = await updateDeliveryPoint(editingPoint.id, {
        name: form.name,
        address: form.address,
        schedule: form.schedule || undefined,
        maps_url: form.maps_url || undefined,
      })
    } else {
      ok = await createDeliveryPoint({
        name: form.name,
        address: form.address,
        schedule: form.schedule || undefined,
        maps_url: form.maps_url || undefined,
      })
    }

    if (ok) {
      setShowModal(false)
      await loadData()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este punto de entrega?')) return
    const ok = await deleteDeliveryPoint(id)
    if (ok) await loadData()
  }

  async function handleToggleActive(point: DeliveryPoint) {
    const ok = await updateDeliveryPoint(point.id, { is_active: !point.is_active })
    if (ok) await loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">autorenew</span>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-low p-6 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-primary-container"></span>
            <span className="font-label-mono text-label-mono uppercase text-primary tracking-widest">// LOGISTICS NETWORK</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">PUNTOS DE ENTREGA</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2.5 font-label-caps text-label-caps text-on-surface uppercase tracking-wider transition-colors shadow-sm"
            type="button"
            onClick={loadData}
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">refresh</span>
            ACTUALIZAR
          </button>
          <button
            className="flex items-center gap-2 bg-primary-container hover:bg-white text-on-primary-container hover:text-surface px-5 py-2.5 font-label-caps text-label-caps uppercase tracking-wider font-bold transition-all shadow-md"
            type="button"
            onClick={openCreate}
          >
            <span className="material-symbols-outlined text-[20px]">add_location</span>
            NUEVO PUNTO (+)
          </button>
        </div>
      </div>

      {/* Points grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {points.length === 0 ? (
          <div className="col-span-full bg-surface-container-low p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-outline">location_off</span>
            <p className="font-label-mono text-body-md text-on-surface-variant mt-3">NO HAY PUNTOS DE ENTREGA REGISTRADOS</p>
            <button
              className="font-label-mono text-label-mono text-primary hover:underline uppercase mt-2"
              onClick={openCreate}
            >
              + CREAR PRIMER PUNTO
            </button>
          </div>
        ) : (
          points.map(point => (
            <div key={point.id} className={`bg-surface-container-low p-5 shadow-md flex flex-col gap-4 transition-all hover:shadow-lg ${!point.is_active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                  <h3 className="font-headline-sm text-body-md font-bold text-on-surface uppercase">{point.name}</h3>
                </div>
                <span className={`px-2 py-0.5 font-label-mono text-[10px] font-bold uppercase ${
                  point.is_active
                    ? 'bg-surface-container-high text-primary'
                    : 'bg-error-container text-on-error-container'
                }`}>
                  {point.is_active ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-on-surface-variant font-body-sm">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">storefront</span>
                  <span>{point.address}</span>
                </div>
                {point.schedule && (
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">schedule</span>
                    <span>{point.schedule}</span>
                  </div>
                )}
                {point.maps_url && (
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">map</span>
                    <a href={point.maps_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-label-mono text-[11px] uppercase">
                      VER EN MAPA
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  onClick={() => openEdit(point)}
                  className="flex-1 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-mono text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  EDITAR
                </button>
                <button
                  onClick={() => handleToggleActive(point)}
                  className="py-2 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-mono text-[11px] transition-colors"
                  title={point.is_active ? 'Desactivar' : 'Activar'}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {point.is_active ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(point.id)}
                  className="py-2 px-3 bg-surface-container hover:bg-error-container text-outline hover:text-on-error-container font-label-mono text-[11px] transition-colors"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-high max-w-lg w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-mono text-label-mono text-primary uppercase font-bold tracking-widest">
                  // {editingPoint ? 'EDITAR' : 'NUEVO'} PUNTO
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                  {editingPoint ? 'MODIFICAR PUNTO' : 'REGISTRAR PUNTO'}
                </h3>
              </div>
              <button className="p-2 bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors" onClick={() => setShowModal(false)} type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">NOMBRE *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="EJ: PUNTO CENTRO"
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">DIRECCIÓN *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  required
                  placeholder="CALLE, NÚMERO, ZONA..."
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">HORARIO</label>
                <input
                  type="text"
                  value={form.schedule}
                  onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
                  placeholder="LUN-SAB: 09:00 - 18:00"
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all uppercase placeholder:text-secondary-container"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">URL GOOGLE MAPS</label>
                <input
                  type="url"
                  value={form.maps_url}
                  onChange={e => setForm(f => ({ ...f, maps_url: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                  className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold uppercase tracking-tight hover:bg-white hover:text-surface transition-all shadow-md"
              >
                {editingPoint ? 'GUARDAR CAMBIOS' : 'CREAR PUNTO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
