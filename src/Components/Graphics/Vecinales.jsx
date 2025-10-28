import axios from "axios";
import { useState, useEffect } from "react";
import { Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import Camara from "../../assets/img/vecinales.png";

const CamarasVecinales = ({ id, updateLayerCount }) => {
    const [camaras, setCamaras] = useState(null);

    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;

    useEffect(() => {
        axios.get(`${endpoint}/camaras/vecinales`)
            .then((res) => {
                setCamaras(res.data);
                console.log(res.data);

                updateLayerCount(id, res.data.length);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            updateLayerCount(id, 0);
        }
    }, []);

    return (
        <>
            {camaras && camaras.map((camara, index) => {
                const latitud = parseFloat(camara.LATITUD);
                const longitud = parseFloat(camara.LONGITUD);

                return (
                    !isNaN(latitud) && !isNaN(longitud) ?
                        <Marker
                            key={index}
                            position={[latitud, longitud]}
                            icon={L.icon({
                                iconUrl: Camara,
                                iconSize: [40, 30],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                            })}
                        >
                            <Popup>
                                <div className="w-[200px] text-sm font-sans">
                                    <p><strong>Vecino:</strong> {camara.nombre_vecino}</p>
                                    <p><strong>Coordenadas:</strong> {`${camara.LATITUD}, ${camara.LONGITUD}`}</p>
                                    <p><strong>Datos Técnicos:</strong> {camara.DATOS_TECNICOS}</p>
                                    <p><strong>Tipo:</strong> {camara.TIPO}</p>
                                    <p><strong>Modelo:</strong> {camara.MODELO}</p>
                                </div>
                            </Popup>
                        </Marker>
                        :
                        <></>
                )

            })}
        </>
    );
};

export default CamarasVecinales;
