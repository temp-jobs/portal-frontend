'use client';

import React, { useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
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
              endIcon && (
                <InputAdornment position="end">{endIcon}</InputAdornment>
              )
            )}
          </>
        ),
        sx: {
          backgroundColor: 'background.paper',
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'grey.300',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.light}33`,
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
