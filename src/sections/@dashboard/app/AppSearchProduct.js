import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Button, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
    // marginLeft: '350px',
    minHeight: '0px !important',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 320,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

// ----------------------------------------------------------------------

AppSearchProduct.propTypes = {
    keyword: PropTypes.string,
    onFilterName: PropTypes.func,
    onDeleteSearch: PropTypes.func,
};

export default function AppSearchProduct({ keyword, onFilterName, onDeleteSearch }) {
    return (
        <StyledRoot>
            <StyledSearch
                value={keyword}
                onChange={onFilterName}
                placeholder="Tìm sản phẩm..."
                size="small"
                startAdornment={
                    <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                }
                sx={{ backgroundColor: 'white' }}
            />
            {keyword && (
                <Button
                    variant="outlined"
                    startIcon={<Iconify icon="material-symbols:delete-outline" width="25px" />}
                    sx={{
                        color: '#f42525',
                        backgroundColor: 'white',
                        position: 'absolute',
                        ml: 40,
                        border: 'none',
                        '&:hover': {
                            backgroundColor: '#ff563014',
                            border: 'none',
                        },
                    }}
                    onClick={onDeleteSearch}
                >
                    Xóa
                </Button>
            )}
        </StyledRoot>
    );
}
