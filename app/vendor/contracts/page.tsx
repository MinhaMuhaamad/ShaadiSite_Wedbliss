'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, Eye, Trash2, CheckCircle, Clock, Send, Plus } from 'lucide-react';

interface Contract {
  id: string;
  bookingId: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  fileName: string;
  uploadedDate: string;
  status: 'pending_signature' | 'signed' | 'draft';
  fileSize: string;
}

const contracts: Contract[] = [
  {
    id: '1',
    bookingId: '1',
    brideName: 'Priya Sharma',
    groomName: 'Raj Kumar',
    eventDate: 'June 15, 2024',
    fileName: 'Priya_Raj_Photography_Contract.pdf',
    uploadedDate: 'Mar 10, 2024',
    status: 'signed',
    fileSize: '245 KB'
  },
  {
    id: '2',
    bookingId: '2',
    brideName: 'Anjali Patel',
    groomName: 'Arjun Singh',
    eventDate: 'July 20, 2024',
    fileName: 'Anjali_Arjun_Photography_Contract.pdf',
    uploadedDate: 'Mar 12, 2024',
    status: 'pending_signature',
    fileSize: '256 KB'
  },
  {
    id: '3',
    bookingId: '3',
    brideName: 'Neha Gupta',
    groomName: 'Vikram Patel',
    eventDate: 'August 10, 2024',
    fileName: 'Neha_Vikram_Contract_Draft.pdf',
    uploadedDate: 'Mar 14, 2024',
    status: 'draft',
    fileSize: '198 KB'
  },
  {
    id: '4',
    bookingId: '4',
    brideName: 'Pooja Singh',
    groomName: 'Rohit Verma',
    eventDate: 'May 25, 2024',
    fileName: 'Pooja_Rohit_Photography_Contract.pdf',
    uploadedDate: 'Feb 28, 2024',
    status: 'signed',
    fileSize: '267 KB'
  }
];

const statusColors = {
  signed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Signed' },
  pending_signature: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Signature' },
  draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
};

export default function ContractsPage() {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contracts & Documents</h1>
          <p className="mt-2 text-muted-foreground">
            Upload, manage, and track contract signatures
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Contract</CardTitle>
          <CardDescription>Upload your service agreement or quotation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center hover:bg-muted/50 transition cursor-pointer">
            <Upload className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">
              Drag and drop your contract here
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              or click to select files (PDF, DOCX up to 10MB)
            </p>
            <Button variant="outline" size="sm">
              Select File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-semibold">Your Contracts ({contracts.length})</h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="cursor-pointer">All</Badge>
            <Badge variant="outline" className="cursor-pointer">Signed</Badge>
            <Badge variant="outline" className="cursor-pointer">Pending</Badge>
            <Badge variant="outline" className="cursor-pointer">Draft</Badge>
          </div>
        </div>

        {contracts.map((contract) => {
          const statusInfo = statusColors[contract.status];
          const isSelected = selectedContract === contract.id;

          return (
            <Card
              key={contract.id}
              className={`cursor-pointer transition ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedContract(contract.id)}
            >
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  {/* Contract Info */}
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                        <span className="text-xs font-bold">PDF</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{contract.fileName}</h3>
                          <Badge className={`${statusInfo.bg} ${statusInfo.text}`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="text-xs uppercase font-medium">For</p>
                            <p className="font-medium text-foreground">
                              {contract.brideName} & {contract.groomName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-medium">Event</p>
                            <p className="font-medium text-foreground">{contract.eventDate}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-medium">Uploaded</p>
                            <p>{contract.uploadedDate}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-medium">Size</p>
                            <p>{contract.fileSize}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {contract.status === 'draft' && (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Send className="h-4 w-4 mr-1" />
                        Send for Signature
                      </Button>
                    )}
                    {contract.status === 'pending_signature' && (
                      <Button size="sm" variant="outline" className="text-yellow-700">
                        <Clock className="h-4 w-4 mr-1" />
                        Awaiting Signature
                      </Button>
                    )}
                    {contract.status === 'signed' && (
                      <Button size="sm" disabled className="bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Signed
                      </Button>
                    )}

                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contract Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Templates</CardTitle>
          <CardDescription>Download our pre-made templates to save time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: 'Photography Service Agreement', size: '156 KB' },
              { name: 'Catering Service Contract', size: '142 KB' },
              { name: 'Decoration Package Deal', size: '128 KB' }
            ].map((template, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <p className="font-medium text-sm mb-3">{template.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{template.size}</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
