import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import Helper from '../../../helper/Helper';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
    product: PropTypes.object,
    onOrder: PropTypes.func,
};

export default function ShopProductCard({ product, onOrder }) {
    const { id, title, photo, sizes } = product;

    return (
        <Card
            sx={{
                '&:hover': {
                    boxShadow: '0px 2px 5px #0000004d',
                },
            }}
        >
            <Box sx={{ pt: '100%', position: 'relative', cursor: 'pointer' }}>
                <StyledProductImg
                    alt={title}
                    src={photo}
                    onClick={() => {
                        onOrder(id);
                    }}
                />
            </Box>

            <Stack spacing={2} sx={{ pb: 1, pl: 0.5, pr: 0.5, textAlign: 'center' }}>
                <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{
                        color: '#53382c',
                        textTransform: 'uppercase',
                        fontWeight: 'bolder',
                        fontFamily: 'fontkhachhang',
                        cursor: 'pointer',
                        '&:hover': {
                            color: '#f14a50',
                        },
                    }}
                    onClick={() => {
                        onOrder(id);
                    }}
                >
                    {title}
                </Typography>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        textTransform: 'uppercase',
                        fontWeight: 'bolder',
                        color: '#53382c',
                        mt: '0px !important',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {sizes.length === 1 ? (
                        <Typography
                            sx={{
                                color: '#53382c',
                                fontFamily: 'fontkhachhang',
                            }}
                        >
                            Giá
                        </Typography>
                    ) : (
                        <Typography
                            sx={{
                                color: '#53382c',
                                fontFamily: 'fontkhachhang',
                            }}
                        >
                            {sizes.map((item, index) => (
                                <span key={index} style={{ marginRight: 4 }}>
                                    {item.name}
                                </span>
                            ))}
                        </Typography>
                    )}

                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 'bolder',
                            color: '#53382c',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        &nbsp;
                        {Helper.formatCurrencyToVND(sizes[0].price)}
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
