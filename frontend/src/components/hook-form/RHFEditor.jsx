import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import Editor from '../editor';

// ----------------------------------------------------------------------

RHFEditor.propTypes = {
  name: PropTypes.string,
  simple: PropTypes.bool,
};

export default function RHFEditor({ name, simple, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          id={name.replaceAll('.', '')}
          value={field.value}
          onChange={field.onChange}
          simple={simple}
          error={!!error}
          helperText={
            <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
              {error?.message}
            </FormHelperText>
          }
          {...other}
        />
      )}
    />
  );
}
