import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
    products: PropTypes.array.isRequired,
    onOrder: PropTypes.func,
};

export default function ProductList({ products, onOrder, ...other }) {
    return (
        <Grid container spacing={3} {...other} sx={{ p: 2, mt: 2 }}>
            {products.map((product) => (
                <Grid key={product.id} item xs={3} sm={3} md={3}>
                    <ShopProductCard
                        product={product}
                        onOrder={(idProduct) => {
                            onOrder(idProduct);
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
