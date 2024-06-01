import PropTypes from 'prop-types';
// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

AppSearchCategory.propTypes = {
    indexCategory: PropTypes.number,
    options: PropTypes.array,
    onSort: PropTypes.func,
};

export default function AppSearchCategory({ indexCategory, options, onSort }) {
    return (
        <TextField
            select
            size="small"
            value={indexCategory}
            onChange={onSort}
            // id="outlined-basic"
            sx={{
                width: '120px',
                margin: 0,
                backgroundColor: 'white',
                // borderRadius: '15px',
                border: 'none',
                // '& .MuiOutlinedInput-root': {
                //     '&.Mui-focused fieldset': {
                //         borderColor: 'rgb(113, 55, 55)',
                //     },
                // },
            }}
        >
            {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.title}
                </MenuItem>
            ))}
        </TextField>
    );
}
