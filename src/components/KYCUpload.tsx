'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type KYCFields = 'aadharFront' | 'aadharBack' | 'panCard' | 'bankDetails';

export default function KYCUpload() {
    const [files, setFiles] = useState<Record<KYCFields, File | null>>({
        aadharFront: null,
        aadharBack: null,
        panCard: null,
        bankDetails: null,
    });

    const handleFileChange = (key: KYCFields, file: File | null) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    const renderPreview = (file: File | null) => {
        if (!file) return null;
        const isImage = file.type.startsWith('image/');
        const url = URL.createObjectURL(file);

        return isImage ? (
            <img src={url} alt="preview" className="h-24 w-auto rounded border" />
        ) : (
            <p className="text-sm text-muted-foreground">{file.name}</p>
        );
    };

    const handleSubmit = () => {
        console.log('Submitting KYC files:', files);
        // Upload logic here
    };

    return (
        <Card className="max-w-3xl mx-auto mt-10 p-6 shadow-md">
            <CardHeader>
                <h2 className="text-xl font-bold text-center">KYC Document Upload</h2>
            </CardHeader>
            <CardContent className="space-y-6">
                {([
                    { label: 'Aadhar Card – Front Side', key: 'aadharFront' },
                    { label: 'Aadhar Card – Back Side', key: 'aadharBack' },
                    { label: 'PAN Card', key: 'panCard' },
                    { label: 'Bank Details', key: 'bankDetails' },
                ] as { label: string; key: KYCFields }[]).map(({ label, key }) => (
                    <div key={key} className="flex flex-col items-center gap-6">
                        <div className="flex-1">
                            <Label htmlFor={key}>{label}</Label>
                            <Input
                                id={key}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={e => handleFileChange(key, e.target.files?.[0] || null)}
                            />
                        </div>
                        <div className="w-32">{renderPreview(files[key])}</div>
                    </div>
                ))}

                <div className="text-center pt-4">
                    <Button onClick={handleSubmit}>Submit Documents</Button>
                </div>
            </CardContent>
        </Card>
    );
}