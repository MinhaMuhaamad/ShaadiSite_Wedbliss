'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InvitationEditorPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.28fr_0.72fr]">
      <Card className="border-fuchsia-100">
        <CardHeader><CardTitle>Invitation Studio</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">Templates</Button>
          <Button variant="outline" className="w-full justify-start">Text</Button>
          <Button variant="outline" className="w-full justify-start">Photos</Button>
          <Button variant="outline" className="w-full justify-start">Elements</Button>
          <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/60 p-3">
            <p className="text-sm font-medium">Upload Custom Media</p>
            <Input type="file" className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 rounded-xl border border-fuchsia-100 p-3">
          <Button size="sm" variant="outline">Undo</Button>
          <Button size="sm" variant="outline">Redo</Button>
          <Input type="range" min={25} max={200} defaultValue={100} className="max-w-xs" />
          <Link href="/dashboard/invitation-studio/send"><Button size="sm">Proceed to Send</Button></Link>
        </div>
        <Card className="border-fuchsia-100">
          <CardContent className="flex min-h-[70vh] items-center justify-center p-8">
            <div className="w-[22rem] rounded-xl border bg-white p-6 shadow">
              <p className="text-center text-sm text-muted-foreground">Together with their families</p>
              <p className="mt-3 text-center text-4xl font-bold">Amelia &amp; Thomas</p>
              <p className="mt-3 text-center text-fuchsia-700">SAVE THE DATE</p>
              <p className="mt-4 text-center text-sm">
                Saturday, September 14th, 2026<br />At Four O&apos;Clock in the Afternoon
              </p>
              <p className="mt-3 text-center text-sm">The Glass House, New York</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
