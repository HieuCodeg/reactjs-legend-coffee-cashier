import jwtDecode from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// cookies
import cookies from 'react-cookies';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import loginService from '../../../services/loginService';

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [state, setState] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        usernameErr: '',
        passwordErr: '',
        err: '',
    });

    useEffect(() => {
        const accessToken = cookies.load('accessToken');
        if (accessToken) {
            try {
                const token = jwtDecode(accessToken);
                const exp = new Date(token.exp * 1000);
                const timeNow = new Date();

                if (exp >= timeNow) {
                    navigate('/home', { replace: true });
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [`${e.target.name}Err`]: '',
            err: '',
        });
    };
    const { username, password } = state;
    const { usernameErr, passwordErr, err } = errors;

    const handleClick = async () => {
        setLoading(true);

        try {
            const result = await loginService.login(state);

            cookies.save('accessToken', result.data.token);
            cookies.save('usernameToken', result.data.name);
            cookies.save('idToken', result.data.id);
            navigate('/home', { replace: true });
        } catch (error) {
            if (error.response) {
                const { username, password } = error.response.data;
                setErrors({
                    ...errors,
                    usernameErr: username,
                    passwordErr: password,
                    err: error.response.data.message,
                });
            } else {
                setErrors({
                    ...errors,
                    err: 'Lỗi hệ thống, vui lòng liên hệ admin !',
                });
            }
            setLoading(false);
        }
    };
    // document.addEventListener('keydown', (event) => {
    //     if (event.keyCode === 13) {
    //         handleClick();
    //     }
    // });

    return (
        <>
            <Stack spacing={3}>
                <TextField
                    error={Boolean(usernameErr)}
                    helperText={usernameErr}
                    name="username"
                    type="email"
                    label="Tên đăng nhập"
                    value={username}
                    onChange={handleInputChange}
                />

                <TextField
                    error={Boolean(passwordErr)}
                    helperText={passwordErr}
                    name="password"
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {err && (
                    <TextField
                        value={err}
                        variant="filled"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        sx={{
                            backgroundColor: '#ffd5dd',

                            input: {
                                color: 'red',
                                textAlign: 'center',
                                paddingTop: '15px',
                                paddingBottom: '15px',
                            },
                            borderRadius: '8px',
                        }}
                    />
                )}
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Checkbox name="remember" label="Remember me" />
                <Link variant="subtitle2" underline="hover">
                    Quên mật khẩu?
                </Link>
            </Stack>

            <LoadingButton
                loading={loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleClick}
            >
                Đăng nhập
            </LoadingButton>
        </>
    );
}
