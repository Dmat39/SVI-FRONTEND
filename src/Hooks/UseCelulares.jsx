import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setCelulares } from '../redux/slices/CelularesSlice';
import { showToast } from '../redux/slices/toastsSlice';
import { socket } from '../Components/Socket/socket';

const UseCelulares = () => {
    const dispatch = useDispatch();

    const FirstFetchCel = () => {
        axios.get(`${import.meta.env.VITE_APP_ENDPOINT}/api/celrealtime`)
            .then(response => {
                if (response.status === 200) {
                    const { posiciones } = response.data;
                    
                    dispatch(setCelulares(posiciones));
                    if (posiciones.length === 0) {
                        dispatch(showToast({
                            message: "No existen celulares activos",
                            type: 'error',
                            duration: 2000
                        }));
                    }
                    return;
                }

                if (response.status === 204) {
                    dispatch(setCelulares([]));
                    dispatch(showToast({
                        message: "Hubo un error al cargar los celulares",
                        type: 'error',
                        duration: 2000
                    }));
                }
            }).catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        console.log("entrando por primera vez celpos");
        
        FirstFetchCel()

        socket.on('celpos', (data) => {
            // const resultado = data.filter(item => item.id == "4586c70adf95d92b");
            console.log(data,"james recibiendo celpos");
            
            dispatch(setCelulares(data))
            // console.log(data,"james enviando celpos123333");
            
        })

        return () => {
            socket.off('celpos');
        }
    }, [])

    return { FirstFetchCel };
}

export default UseCelulares