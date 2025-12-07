// src/pages/dashboard/ExportDataCard.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useExportViewModel } from '@/viewmodels/useExportViewModel'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'

export const ExportDataCard = () => {
  const { loadingCSV, loadingXLSX, errorExport, handleExport } = useExportViewModel()

  return (
    <Card className="col-span-full lg:col-span-2"> {/* Pode ajustar o span conforme o layout desejado */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Exportar Dados</CardTitle>
        <Download className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Baixe os logs de clima históricos em diferentes formatos.
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => handleExport('csv')}
            disabled={loadingCSV || loadingXLSX}
            className="flex-1"
          >
            {loadingCSV ? 'Exportando CSV...' : (
              <>
                <FileText className="mr-2 h-4 w-4" /> Exportar CSV
              </>
            )}
          </Button>
          <Button
            onClick={() => handleExport('xlsx')}
            disabled={loadingCSV || loadingXLSX}
            className="flex-1"
          >
            {loadingXLSX ? 'Exportando XLSX...' : (
              <>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar XLSX
              </>
            )}
          </Button>
        </div>
        {errorExport && (
          <p className="text-sm text-destructive mt-2">{errorExport}</p>
        )}
      </CardContent>
    </Card>
  )
}
