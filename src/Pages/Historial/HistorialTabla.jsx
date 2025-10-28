import React from "react";
import { CircularProgress } from "@mui/material";
import * as XLSX from 'xlsx';

const HistorialTabla = ({ tableData, isLoading }) => {
  console.log(tableData);
  let countTotal = 0;

  const maxCodigoIncidencias = tableData.reduce((max, entry) => {
    const maxUserIncidencias = entry.users.reduce((userMax, user) => {
      countTotal += user.codigo_incidencias.length;
      return Math.max(userMax, user.codigo_incidencias.length);
    }, 0);
    return Math.max(max, maxUserIncidencias);
  }, 0);

  const headers = ["JURISDICCION", "SERENOS", "CODIGOS", "CUENTA"];

  return (
    <>
      <div className="overflow-auto flex flex-1">
        <table className="min-w-full bg-white border text-xs text-nowrap h-max">
          <thead>
            <tr>
              <th
                colSpan={headers.length + maxCodigoIncidencias - 1}
                className="py-2 px-2 border uppercase"
              >
                HISTORIAL INCIDENCIAS
              </th>
            </tr>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={`${header}${index}`}
                  className="px-2 border"
                  colSpan={header === "CODIGOS" ? maxCodigoIncidencias : 1}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={headers.length} className="py-4 text-center">
                  <CircularProgress />
                  <p>Cargando historial...</p>
                </td>
              </tr>
            ) : !tableData || tableData.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="py-4 text-center">
                  <p>No se encontraron incidentes para este turno</p>
                </td>
              </tr>
            ) : (
              <>
                {tableData.map((jurisdiccionObj, jurisdiccionIndex) => (
                  <React.Fragment key={jurisdiccionObj.jurisdiccion_id}>
                    {jurisdiccionObj.users.map((serenoObj, serenoIndex) => (
                      <tr key={`${jurisdiccionObj.jurisdiccion_id}-${serenoIndex}`}>
                        {serenoIndex === 0 && (
                          <td
                            rowSpan={jurisdiccionObj.users.length}
                            className="px-2 border text-center"
                          >
                            {jurisdiccionObj.jurisdiccion}
                          </td>
                        )}
                        <td className="px-2 border text-center">
                          {serenoObj.nombre_reportante}
                        </td>
                        {Array.from({ length: maxCodigoIncidencias }, (_, indexCode) => (
                          <td
                            key={`${jurisdiccionObj.jurisdiccion_id}-${serenoIndex}-${indexCode}`}
                            className="px-2 border text-center"
                          >
                            {serenoObj.codigo_incidencias[indexCode] || ""}
                          </td>
                        ))}
                        <td className="px-2 border text-center">
                          {serenoObj.codigo_incidencias.length}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr>
                  <td className="invisible" colSpan={headers.length + maxCodigoIncidencias - 2}></td>
                  <td className="px-2 border text-center">{countTotal}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HistorialTabla;
