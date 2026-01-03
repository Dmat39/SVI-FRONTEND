import {useState,useEffect,useRef} from "react";
import {
  Grid,
  Divider,
  Autocomplete,
  TextField,
  MenuItem,
} from "@mui/material";
import Select from "@mui/material/Select";


const IncidenciaTipificacion = ({ dataSets, formik }) => {

  const [subtipoOptions, setSubtipoOptions] = useState(dataSets.subTipo);

  useEffect(() => {
    if (dataSets.subTipo && dataSets.subTipo.length > 0) {

      setSubtipoOptions(dataSets.subTipo);
    }
  }, [dataSets.subTipo]);
  return (
    <>
      <Grid item xs={12} sm={12} md={12} key="Ubicacion de incidencia">
        <h2 className="text-lg font-bold ">Tipificacion de incidencia</h2>
        <Divider />
      </Grid>

      {/* Select de unidad_id comentado - estaba deshabilitado y causaba errores de validación */}
      {/* <Select
        name="unidad_id"
        size="small"
        value={formik.values.unidad_id}
        label="unidades comprobando"
        onChange={formik.handleChange}
        disabled

        sx={{
          "& .MuiInputBase-input": { fontSize: "0.8rem" },
          "& .MuiFormHelperText-root": { fontSize: "0.7rem" },
          "& .MuiInputLabel-root": { fontSize: "0.8rem" },
          mt: 2,height: 35,ml:2
        }}

      >
        {dataSets?.unidad.map((item) => (
          <MenuItem key={item.id} value={item.id} >
            {item.descripcion}{""}

          </MenuItem>
        ))}
      </Select> */}
      <Grid item xs={12} sm={6} md={4} key="tipo_caso_id">
        <Autocomplete
          options={dataSets.tipoCaso || []}
          loading={true}
          value={dataSets.tipoCaso.find(opt => opt.id === formik.values.tipo_caso_id) || null}
          
          loadingText="Cargando..."
          getOptionLabel={(option) =>
            option.nombre ||
            option.descripcion ||
            option.nombres +
              " " +
              option.apellidoPaterno +
              " " +
              option.apellidoMaterno ||
            ""
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onChange={(event, value) =>{
            const choosedSubtipo = value.id
            const dataTipo =  dataSets.subTipo.filter(subtipo => {
              return subtipo.tipo_caso_id == choosedSubtipo
            })
            setSubtipoOptions(dataTipo)
            formik.setFieldValue("tipo_caso_id", value?.id || "")
          }
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo de Caso"
              size="small"
              name="tipo_caso_id"
              fullWidth
              error={
                formik.touched.tipo_caso_id &&
                Boolean(formik.errors.tipo_caso_id)
              }
              helperText={
                formik.touched.tipo_caso_id && formik.errors.tipo_caso_id
              }
              sx={{
                "& .MuiInputBase-input": { fontSize: "0.8rem" }, // Ajusta el tamaño del texto del input
                "& .MuiFormHelperText-root": { fontSize: "0.7rem" }, // Ajusta el tamaño del texto de ayuda
                "& .MuiInputLabel-root": { fontSize: "0.8rem" }, // Ajusta el tamaño del label
              }}
            />
          )}
          sx={{
            "& .MuiAutocomplete-option": { fontSize: "0.8rem" }, // Ajusta el tamaño de las opciones
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} key="sub_tipo_caso_id">
        <Autocomplete
          options={subtipoOptions || []}
          
          value={dataSets.subTipo.find(opt => opt.id === formik.values.sub_tipo_caso_id) || null}
          loading={true}
          loadingText="Cargando..."
          getOptionLabel={(option) =>
            option.nombre ||
            option.descripcion ||
            option.nombres +
              " " +
              option.apellidoPaterno +
              " " +
              option.apellidoMaterno ||
            ""
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, value) =>
            formik.setFieldValue("sub_tipo_caso_id", value?.id || "")
          }
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.descripcion}
            </li>
          )}
          renderInput={(params) => (
            
            <TextField
              {...params}
              label="Subtipo de Caso"
              size="small"
              name="sub_tipo_caso_id"
              fullWidth
             
              error={
                formik.touched.sub_tipo_caso_id &&
                Boolean(formik.errors.sub_tipo_caso_id)
              }
              helperText={
                formik.touched.sub_tipo_caso_id &&
                formik.errors.sub_tipo_caso_id
              }
              sx={{
                "& .MuiInputBase-input": { fontSize: "0.8rem" }, // Ajusta el tamaño del texto del input
                "& .MuiFormHelperText-root": { fontSize: "0.7rem" }, // Ajusta el tamaño del texto de ayuda
                "& .MuiInputLabel-root": { fontSize: "0.8rem" }, // Ajusta el tamaño del label
              }}
            />
          )}
          sx={{
            "& .MuiAutocomplete-option": { fontSize: "0.8rem" }, // Ajusta el tamaño de las opciones
          }}
        />
      </Grid>
    </>
  );
};

export default IncidenciaTipificacion;
