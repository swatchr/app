import { useEffect, useState } from 'react';

import { InputUser } from '@/hooks/use-input';
import { validateAndConvertHexColor } from '@/utils';
import { api } from '@/utils/api';
import { HEX_COLOR_WITHOUT_HASH_REGEX_STRING } from '@/utils/constants';

export function SidebarTests() {
  return (
    <>
      <TestColorCreate />
      <TestColorGet />
      <TestColorGetAll />
      <TestColorUpdate />
      <TestColorDelete />
    </>
  );
}

function TestColorCreate() {
  const mutation = api.color.save.useMutation();

  return (
    <>
      <InputUser
        showLabel
        name="create-color"
        config={{
          type: 'text',
          name: 'state',
          onSubmit: (e) => {
            e.preventDefault();
            const color = mutation.mutate({
              hex: e.currentTarget.querySelector('input')?.value!?.trim(),
            });
          },
          placeholder: 'Enter a hex color without the "#"',
          pattern: HEX_COLOR_WITHOUT_HASH_REGEX_STRING,
        }}
      />
      {mutation.isSuccess &&
        JSON.stringify(
          { success: mutation.isSuccess, data: mutation.data },
          null,
          2
        )}
    </>
  );
}
function TestColorGet() {
  const [state, setState] = useState<string>('');
  const { data, isLoading, isSuccess, isError } = api.color.get.useQuery(
    { hex: state },
    {
      enabled: !!state?.length,
    }
  );

  return (
    <>
      <InputUser
        showLabel
        name="get-color"
        config={{
          type: 'text',
          name: 'state',
          onSubmit: (e) => {
            e.preventDefault();
            setState(e.currentTarget.querySelector('input')?.value!?.trim());
          },
          placeholder: 'Enter a hex color without the "#"',
          pattern: HEX_COLOR_WITHOUT_HASH_REGEX_STRING,
        }}
      />
      {isSuccess && JSON.stringify({ success: isSuccess, data }, null, 2)}
    </>
  );
}
function TestColorGetAll() {
  const [state, setState] = useState<string[]>(['']);
  const { data, isLoading, isSuccess, isError } = api.color.getAll.useQuery(
    { palette: state },
    {
      enabled: !!state?.length,
    }
  );

  return (
    <>
      <InputUser
        showLabel
        name="get-all-colors"
        config={{
          type: 'text',
          name: 'state',
          onSubmit: (e) => {
            e.preventDefault();
            const palette = e.currentTarget
              .querySelector('input')
              ?.value!?.trim()
              .split(', ')
              .map((hex: string) => {
                validateAndConvertHexColor(hex);
                return hex;
              });
            setState(palette);
          },
          placeholder: 'Enter a hex palette without the "#"',
        }}
      />
      {isSuccess && JSON.stringify({ success: isSuccess, data }, null, 2)}
    </>
  );
}

function TestColorUpdate() {
  const mutation = api.color.update.useMutation();

  return (
    <>
      <InputUser
        showLabel
        name="update-color"
        config={{
          type: 'text',
          name: 'state',
          onSubmit: (e) => {
            e.preventDefault();
            mutation.mutate({
              hex: e.currentTarget.querySelector('input')?.value!?.trim(),
              data: {
                name: 'Red',
              },
            });
          },
          placeholder: 'Enter a hex color without the "#"',
          pattern: HEX_COLOR_WITHOUT_HASH_REGEX_STRING,
        }}
      />
      {mutation.isSuccess &&
        JSON.stringify(
          { success: mutation.isSuccess, data: mutation.data },
          null,
          2
        )}
    </>
  );
}

function TestColorDelete() {
  const mutation = api.color.delete.useMutation();

  return (
    <>
      <InputUser
        showLabel
        name="delete-color"
        config={{
          type: 'text',
          name: 'state',
          onSubmit: (e) => {
            e.preventDefault();
            mutation.mutate({
              hex: e.currentTarget.querySelector('input')?.value!?.trim(),
            });
          },
          placeholder: 'Enter a hex color without the "#"',
          pattern: HEX_COLOR_WITHOUT_HASH_REGEX_STRING,
        }}
      />
      {mutation.isSuccess &&
        JSON.stringify(
          { success: mutation.isSuccess, data: mutation.data },
          null,
          2
        )}
    </>
  );
}
