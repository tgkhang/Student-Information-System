import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
import { DebounceInput } from 'react-debounce-input';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  defaultValue: PropTypes.string,
};

export default function RHFTextField({ name, defaultValue, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <DebounceInput
          {...field}
          element={TextField}
          debounceTimeout={500}
          inputRef={ref}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
