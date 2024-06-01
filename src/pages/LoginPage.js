import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';

// components
// sections
import { LoginForm } from '../sections/auth/login';

import logo from '../assets/images/logo.png';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
    return (
        <>
            <Helmet>
                <title> Login | Coffee Legend </title>
            </Helmet>

            <StyledRoot>
                <img
                    src={logo}
                    alt="Logo"
                    height="100px"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '100px',
                    }}
                />

                <StyledSection>
                    <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                        Chào mừng đến với Coffee Legend!
                    </Typography>
                    <img src="/assets/illustrations/illustration_login.png" alt="login" />
                </StyledSection>

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Đăng nhập vào Coffee Legend
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Không có tài khoản? {''}
                            <Link variant="subtitle2">Bắt đầu</Link>
                        </Typography>

                        {/* <Stack direction="row" spacing={2}>
                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                            </Button>

                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                            </Button>

                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
                            </Button>
                        </Stack> */}

                        {/* <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Hoặc
                            </Typography>
                        </Divider> */}

                        <LoginForm />
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
