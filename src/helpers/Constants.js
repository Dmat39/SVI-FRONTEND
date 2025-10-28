export const TIPO_JUSTIFICACIONES = ["A", 'F', "DO", "DL", "DC", "LF", "NA", "DM", "LSG", "LCG", "SSG", "V", "R", "DF"] // No es dinamico se tiene que sincronizar con la base de datos si se cambia
export const TIPO_DESCANSOS = ['DL', 'DO', 'DC']

export const ESTADOS = [
  { value: 'true', label: 'Trabajando' },
  { value: 'false', label: 'Cesado' },
];

export const PERMISOS_EXCLUIDOS = ['usuario', 'rol', 'rolesPermiso', 'empleadoPagos',"horario", "blackList", "observacion"];

export const SIMBOLOGIA = [
  { id: "F", bg: "255, 0, 1", text: "255, 255, 255" },
  { id: "DO", bg: "0, 176, 238", text: "255, 255, 255" },
  { id: "DL", bg: "0, 0, 0", text: "255, 255, 255" },
  { id: "DC", bg: "78, 166, 47", text: "255, 255, 255" },
  { id: "LF", bg: "255, 193, 0", text: "255, 255, 255" },
  { id: "NA", bg: "21, 94, 131", text: "255, 255, 255" },
  { id: "DM", bg: "255, 255, 1", text: "255, 255, 255" },
  { id: "LSG", bg: "172, 173, 172", text: "255, 255, 255" },
  { id: "LCG", bg: "249, 198, 169", text: "255, 255, 255" },
  { id: "SSG", bg: "128, 227, 143", text: "255, 255, 255" },
  { id: "V", bg: "235, 113, 53", text: "255, 255, 255" },
  { id: "R", bg: "193, 0, 1", text: "255, 255, 255" },
  { id: "DF", bg: "163, 43, 144", text: "255, 255, 255" },
];