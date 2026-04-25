// src/viewmodels/useExportViewModel.ts
import { useLocationContext } from '@/contexts/LocationContext'
import { weatherService } from '@/services/weather.service'
import { useCallback, useState } from 'react'

export const useExportViewModel = () => {
  const [loadingCSV, setLoadingCSV] = useState(false)
  const [loadingXLSX, setLoadingXLSX] = useState(false)
  const [errorExport, setErrorExport] = useState<string | null>(null)
  const {locationId} = useLocationContext()

  const handleExport = useCallback(async (format: 'csv' | 'xlsx') => {
    setErrorExport(null)
    try {
      let blob: Blob
      let filename: string

      if (format === 'csv') {
        setLoadingCSV(true)
        blob = await weatherService.exportCSV(locationId || '')
        filename = `weather_logs_${new Date().toISOString()}.csv`
      } else { // format === 'xlsx'
        setLoadingXLSX(true)
        blob = await weatherService.exportXLSX(locationId || '')
        filename = `weather_logs_${new Date().toISOString()}.xlsx`
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

    } catch (err: any) {
      console.error(`Erro ao exportar ${format.toUpperCase()}:`, err)
      setErrorExport(`Falha ao exportar ${format.toUpperCase()}.`)
    } finally {
      if (format === 'csv') {
        setLoadingCSV(false)
      } else {
        setLoadingXLSX(false)
      }
    }
  }, [])

  return {
    loadingCSV,
    loadingXLSX,
    errorExport,
    handleExport,
  }
}
