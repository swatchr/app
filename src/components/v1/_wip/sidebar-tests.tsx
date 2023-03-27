import { useEffect, useState } from 'react';

import { validateAndConvertHexColor } from '@/utils';
import { api } from '@/utils/api';
import { HEX_COLOR_WITHOUT_HASH_REGEX_STRING } from '@/utils/constants';
import { WrappedInput } from 'chakra.ui';

export function SidebarTests() {
  return (
    <>
      <TestPaletteCreate />
      <TestColorCreate />
      <TestColorGet />
      <TestColorGetAll />
      <TestColorUpdate />
      <TestColorDelete />
    </>
  );
}

function TestPaletteCreate() {
  const mutation = api.palette.save.useMutation();

  return (
    <>
      <WrappedInput
        showLabel
        name="create-palette"
        config={{
          type: 'text',
          name: 'state',
          onSubmit: (e) => {
            e.preventDefault();
            const palette = mutation.mutate({
              palette: e.currentTarget
                .querySelector('input')
                ?.value!?.trim()
                .split(', ')
                .map((hex) => '#' + hex),
            });
            console.log('🚀 | file: sidebar-tests.tsx:41 | palette:', palette);
          },
          placeholder: 'Enter comma separated hex colors without the "#"',
        }}
      />
    </>
  );
}

function TestColorCreate() {
  const mutation = api.color.save.useMutation();

  return (
    <>
      <WrappedInput
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
      <WrappedInput
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
      <WrappedInput
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
      <WrappedInput
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
      <WrappedInput
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
