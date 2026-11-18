'use client';

import { useState } from 'react';
import { Button, TextArea } from '@truewell/ui';
import { api } from '@/lib/client';
import { useFormState } from '@/hooks/useFormState';
import { validateDraft } from '@/services/messaging';

export function Composer({ threadId, onSent }: { threadId: string; onSent?: () => void }) {
  const [body, setBody] = useState('');
  const [validation, setValidation] = useState<string | null>(null);
  const form = useFormState<string>(async (text) => {
    await api.messages.create({ threadId, body: text });
    setBody('');
    onSent?.();
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const problem = validateDraft(body);
        setValidation(problem);
        if (!problem) void form.run(body.trim());
      }}
    >
      <TextArea label="Reply" value={body} onChange={(e) => setBody(e.target.value)} error={validation ?? form.error ?? undefined} hint="Do not use messages for emergencies. Call 911 or your local emergency number." />
      <Button type="submit" loading={form.pending}>
        Send
      </Button>
    </form>
  );
}
