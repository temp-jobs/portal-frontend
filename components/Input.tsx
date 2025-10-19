'use client';

import React, { useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface InputProps extends Omit<TextFieldProps, 'label'> {
  label: string;
  errorMessage?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  startIcon,
  endIcon,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const theme = useTheme();

  return (
    <TextField
      {...props}
      type={isPassword && showPassword ? 'text' : type}
      label={label}
      fullWidth
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      variant="outlined"
      margin="normal"
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: (
          <>
            {isPassword ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : (
                endIcon && <InputAdornment position="end">{endIcon}</InputAdornment>
              )
            }
          </>
        ),
        sx: {
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[300],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${theme.palette.primary.light}33`,
          },
        },
      }}
      InputLabelProps={{
        sx: {
          fontWeight: 500,
        },
      }}
      FormHelperTextProps={{
        sx: {
          fontSize: 12,
          mt: 0.5,
        },
      }}
    />
  );
};

export default Input;
