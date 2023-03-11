import { InputUser } from '@/hooks/use-input';
import { api } from '@/utils/api';
import { useState } from 'react';
import { HEX_COLOR_WITHOUT_HASH_REGEX_STRING } from '../../../utils/constants';

export function SidebarTests() {
  const [hex, setHex] = useState<string | null>(null);
  const mutation = api.color.delete.useMutation();

  return (
    <>
      <InputUser
        name="color"
        config={{
          type: 'text',
          onSubmit: (e) => {
            e.preventDefault();
            mutation.mutate({
              hex: e.currentTarget.querySelector('input')?.value!,
            });
          },
          placeholder: 'Enter a hex color',
          pattern: HEX_COLOR_WITHOUT_HASH_REGEX_STRING,
        }}
      />
    </>
  );
}
