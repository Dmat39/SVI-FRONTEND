
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HistorialTabla from "./HistorialTabla";
import useFetch from "../../Hooks/UseFetch";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Filtro from "../../Components/FiltroSelect/Filtro";
import UseUrlParamsManager from "../../Components/hooks/UseUrlParamsManager";
import { useNavigate } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from "xlsx-js-style";

const Historial = () => {
    const {addParams} = UseUrlParamsManager()
    const {getData} = useFetch() 
    const [incidenciasHistorial,setIncidenciasHistorial] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const { token } = useSelector((state) => state.auth);
    const [turno,setTurno] = useState('Mañana')
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        fetchIncidencias(location.search|| undefined)
    },[location.search])

    const handleDateChange = (date) => {
        setSelectedDate(date)
        addParams({ fecha: date.format('YYYY-MM-DD') })
    }

    const fetchIncidencias = async (queryParams) => {
        const urlParams = queryParams || '';
        setIsLoading(true)
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT_PRUEBA}/serenos/jurisdicciones`);
            if(response.status){
                const responseIncidencias = await getData(`${import.meta.env.VITE_APP_ENDPOINT_PRUEBA}/preincidencias/historial${urlParams}`,token)
                console.log(responseIncidencias)
                if(responseIncidencias && responseIncidencias.status){
                    if(responseIncidencias.data.length > 0){
                    const historialincidenciasdata = responseIncidencias.data[0].jurisdicciones.map(incidencia => ({
                        ...incidencia,
                        jurisdiccion: response.data.data.find(jurisdiccion => jurisdiccion.id === incidencia.jurisdiccion_id).nombre    
                    }))
                    setIncidenciasHistorial(historialincidenciasdata)   
                }
                else{
                    setIncidenciasHistorial([])
                }
                setIsLoading(false) 
                }
            }
            
            } catch (error) {
                console.log(error)
            }
        
    }

    const exportToExcel = () => {
        const maxCodigoIncidencias = Math.max(
            ...incidenciasHistorial.map(d => d.users[0].codigo_incidencias.length)
        )
        const headers = ["JURISDICCION", "SERENOS", "CODIGO", ...Array(maxCodigoIncidencias - 1).fill("")];
        headers.push("CUENTA")
        const rows = [];
        let totalCuenta = 0;
    
        incidenciasHistorial.forEach(({ jurisdiccion, users }) => {
            users.forEach(({ nombre_reportante, codigo_incidencias }) => {
                const row = [jurisdiccion, nombre_reportante, ...codigo_incidencias]
                while (row.length < headers.length - 1) row.push("")
                row.push(codigo_incidencias.length)
                totalCuenta += codigo_incidencias.length
                rows.push(row)
            });
        });
    
        // 🔹 Agregar la fila de TOTAL
        const totalRow = Array(headers.length - 1).fill("")
        totalRow.push(totalCuenta)
        rows.push(totalRow)
    
        // 🔹 Insertar cabecera principal "HISTORIAL INCIDENCIA"
        const mainTitle = [`HISTORIAL DE INCIDENCIAS TURNO ${turno.toUpperCase()} - ${selectedDate.format('DD/MM/YYYY')}`];
        while (mainTitle.length < headers.length) mainTitle.push("") 
        rows.unshift(headers) 
        rows.unshift(mainTitle) 
    
        const ws = XLSX.utils.aoa_to_sheet(rows)
    
        // 🔹 Ajustar ancho de columnas
        ws["!cols"] = [
            { wch: 40 }, // JURISDICCION
            { wch: 60 }, // SERENOS
            ...Array(maxCodigoIncidencias).fill({ wch: 15 }), // CODIGOS
            { wch: 30 } // CUENTA
        ]
    
        // 🔹 Aplicar estilos
        const cellStyle = {
            font: { bold: false },
            alignment: { vertical: "center", horizontal: "center" },
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
            }
        }
    
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "0070C0" } },
            alignment: { vertical: "center", horizontal: "center" },
            border: cellStyle.border
        };
    
        // 🔹 Estilo para la cabecera principal
        const mainTitleStyle = {
            font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "004085" } }, // Azul oscuro
            alignment: { vertical: "center", horizontal: "center" }
        }
    
        // Aplicar estilos a la cabecera principal
        const mainTitleCellRef = XLSX.utils.encode_cell({ r: 0, c: 0 })
        ws[mainTitleCellRef] = ws[mainTitleCellRef] || {}
        ws[mainTitleCellRef].s = mainTitleStyle
    
        // Fusionar la cabecera principal
        ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
    
        // Aplicar estilos a los encabezados
        headers.forEach((_, colIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: 1, c: colIndex });
            if (!ws[cellRef]) ws[cellRef] = {};
            ws[cellRef].s = headerStyle;
        });
    
        // Aplicar estilos a celdas de datos
        rows.slice(2).forEach((row, rowIndex) => { // Excluye las dos primeras filas (cabecera principal y headers)
            row.forEach((_, colIndex) => {
                const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 2, c: colIndex });
                if (!ws[cellRef]) ws[cellRef] = {};
                ws[cellRef].s = cellStyle;
            });
        });
    
      
        const totalRowIndex = rows.length - 1;
        const totalCellRef = XLSX.utils.encode_cell({ r: totalRowIndex, c: headers.length - 1 });
    
        ws[totalCellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "FF5733" } }, // Naranja
            alignment: { vertical: "center", horizontal: "center" },
            border: cellStyle.border
        };
    
        let startRow = 2; 
        for (let i = 3; i < rows.length; i++) { 
            if (rows[i][0] !== rows[i - 1][0]) { 
                if (i - startRow > 1) { 
                    ws["!merges"].push({ s: { r: startRow, c: 0 }, e: { r: i - 1, c: 0 } });
                }
                startRow = i
            }
        }

        
        if (startRow < rows.length - 1) {
            ws["!merges"].push({ s: { r: startRow, c: 0 }, e: { r: rows.length - 1, c: 0 } });
        }
            
        if (maxCodigoIncidencias > 1) {
            ws["!merges"].push({
                s: { r: 1, c: 2 },
                e: { r: 1, c: 1 + maxCodigoIncidencias }
            });
        }            

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Historial");
        XLSX.writeFile(wb, "Historial_Incidencias.xlsx");
    };
    
    
    
    

    return(
     
    <div className='h-full flex flex-col w-full bg-gray-100 p-4'>
    <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
     <div onClick={() => navigate(-1)} className='flex items-center gap-1'>
         <ArrowBackIosNewRoundedIcon
             className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4'
         />
     </div>
     <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
         Incidencias Historial
     </h1>
 </header>
 <div className='overflow-auto flex flex-col justify-between h-full'>
 <div className="w-full flex items-center gap-2 my-2 h-[40px]">
     <Filtro
        name="turno"
        className={"!min-w-44 h-[40px]"}
        label={'Turnos'}
        onChange={(e) => {
            setTurno(e.target.value)
            addParams({ turno: e.target.value })
        }}
        value={turno}
        options={[{id:1,value:'Mañana',label:"Mañana"},{id:2,value:'Tarde',label:"Tarde"},{id:3,value:'Noche',label:"Noche"},{id:4,value:'No Definido',label:"No Definido"},{id:5,value:'Rotativo',label:"Rotativo"}]}
     />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="!min-w-44 h-[40px]"
        slotProps={{ textField: { size: 'small' } }}
        label="Selecciona una fecha"
        value={selectedDate}
        onChange={handleDateChange}
        format="DD/MM/YYYY" // Formato de fecha
       
      />
    </LocalizationProvider>
        <Button
                                onClick={() => exportToExcel()}
                                color="primary"
                                size="small"
                                className="!capitalize ml-10"
                                
                            >
                                <DownloadIcon className="!size-5" />
                                <div className='mt-1 hidden lg:block text-nowrap'>
                                    Descargar Excel
                                </div>
        </Button>
    </div>    
   <HistorialTabla isLoading={isLoading} tableData={incidenciasHistorial}></HistorialTabla>
 </div>
 </div>
  )
}

export default Historial

