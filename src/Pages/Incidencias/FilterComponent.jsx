import React, { useState, useEffect } from 'react';
import { Checkbox, FormGroup, FormControlLabel, Typography, IconButton, Popover } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// axios no es necesario aquí

const FiltersPopover = ({ itemsFiltros, setItemsFiltros, subsectores }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    

    const handleToggleFilter = (sectorName) => {
        setItemsFiltros((prev) =>{
            if (prev.includes(sectorName)) {
                return prev.filter(item => item !== sectorName);
            }
            return [...prev, sectorName];
        });
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <FilterAltIcon sx={{ color: "#0098e5" }} />
            </IconButton>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div className="p-4">
                    <Typography variant="subtitle1" className="mb-2">
                        Subsectores ({subsectores.length})
                    </Typography>
                    <FormGroup>
                        {subsectores.map((sectorName) => (
                            <FormControlLabel
                                key={sectorName.id}
                                control={
                                    <Checkbox
                                        checked={itemsFiltros.includes(sectorName.id)}
                                        onChange={() => handleToggleFilter(sectorName.id)}
                                        size="small"
                                    />
                                }
                                label={sectorName.nombre}
                                sx={{
                                    '& .MuiCheckbox-root': {
                                        padding: '4px',
                                    },
                                    '& .MuiTypography-root': {
                                        fontSize: '14px',
                                    }
                                }}
                            />
                        ))}
                    </FormGroup>
                </div>
            </Popover>
        </>
    );
};

export default FiltersPopover;